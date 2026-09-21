// DRILL 4 — send SOL, as a state machine                            [90 min]
// Do it: after 2b (3 is optional before this). See it in the "4 · Send" box.
// This is the drill closest to real wallet work.
//
// GOAL
//   A form sends devnet SOL to another address, and the box always tells the
//   truth about where the transaction is: signing → sent → confirmed, or
//   rejected / failed / expired.
//
// SETUP
//   You need a second address to send to: in the Phantom extension add
//   "Account 2" and copy its Devnet address.
//
// STEPS
//   1. State — one discriminated union, not a pile of booleans:

import * as React from 'react'
import { useAccounts, useSolana } from '@phantom/react-sdk'
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { ACCOUNT_2_ADDRESS, connection, explorerTxUrl } from '../../config.ts'
import { parseUnits } from '../../lib/lamports.ts'

// Final result of one submit — what useActionState holds.
type TxResult =
  | { status: 'idle' }
  | { status: 'confirmed'; signature: string }
  | { status: 'rejected' } // user closed the wallet popup
  | { status: 'failed'; message: string; signature?: string }

// Progress while the action is running. useActionState only exposes one
// `isPending` boolean, so the in-flight steps live in their own state.
type TxStep = { status: 'signing' } | { status: 'sent'; signature: string }

const isUserRejection = (e: unknown) => {
  const { code, message } = e as { code?: number; message?: string }
  return code === 4001 || /reject|cancel|denied/i.test(message ?? '')
}

export function SendPanel() {
  const accounts = useAccounts()
  const { solana } = useSolana()
  const address = (accounts ?? []).find((a) => a.addressType === 'Solana')?.address ?? ''

  const [step, setStep] = React.useState<TxStep | null>(null)

  const [result, submitAction, isPending] = React.useActionState(
    async (_prev: TxResult, formData: FormData): Promise<TxResult> => {
      let signature: string | undefined
      try {
        const from = new PublicKey(address)
        const to = new PublicKey(formData.get('recipient') as string) // throws on garbage
        const lamports = parseUnits(formData.get('amount') as string, 9)

        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
        const transaction = new Transaction({
          feePayer: from,
          blockhash,
          lastValidBlockHeight,
        }).add(SystemProgram.transfer({ fromPubkey: from, toPubkey: to, lamports }))

        setStep({ status: 'signing' })
        ;({ signature } = await solana.signAndSendTransaction(transaction))

        setStep({ status: 'sent', signature })
        const res = await connection.confirmTransaction(
          { signature, blockhash, lastValidBlockHeight },
          'confirmed',
        )
        return res.value.err
          ? { status: 'failed', message: JSON.stringify(res.value.err), signature }
          : { status: 'confirmed', signature }
      } catch (e) {
        console.log('send failed', e)
        return isUserRejection(e)
          ? { status: 'rejected' }
          : { status: 'failed', message: (e as Error).message, signature }
      } finally {
        setStep(null)
      }
    },
    { status: 'idle' },
  )

  // While the action runs show the live step, afterwards the final result.
  const tx = isPending && step ? step : result

  if (!address) {
    return (
      <section>
        <h2>4 · Send</h2>
        <p className="muted">Connect a wallet first.</p>
      </section>
    )
  }

  return (
    <section>
      <h2>4 · Send</h2>
      <form action={submitAction} className="row">
        <input name="recipient" defaultValue={ACCOUNT_2_ADDRESS} size={46} />
        <input name="amount" defaultValue="0.1" size={8} />
        <button disabled={isPending}>{isPending ? 'Sending…' : 'Send'}</button>
      </form>

      {tx.status === 'signing' && <p className="muted">Approve in your wallet…</p>}
      {tx.status === 'sent' && <p className="muted">Sent. Waiting for confirmation…</p>}
      {tx.status === 'confirmed' && <p>Confirmed ✔</p>}
      {tx.status === 'rejected' && <p className="muted">Cancelled in the wallet.</p>}
      {tx.status === 'failed' && <p className="error">Failed: {tx.message}</p>}

      {'signature' in tx && tx.signature && (
        <p className="muted">
          <a href={explorerTxUrl(tx.signature)} target="_blank" rel="noreferrer">
            View on explorer
          </a>
        </p>
      )}
    </section>
  )
}
