// Sign in with a signed message: the wallet signs a text message (no
// transaction, no fee), then the app verifies the signature. This is how a
// dapp proves the user owns an address.

import { useState } from 'react'
import { useAccounts, useSolana } from '@phantom/react-sdk'
import nacl from 'tweetnacl'
import bs58 from 'bs58'

type SignInState =
  | { status: 'idle' }
  | { status: 'signing' }
  | { status: 'signed'; message: string; signature: Uint8Array; verified: boolean }
  | { status: 'failed'; message: string }

// Sign-In-With-Solana shape: one field per line so the wallet popup shows
// exactly what is being signed. Domain + nonce + timestamp are what make the
// signature useless anywhere else, or later.
const buildMessage = (address: string) =>
  [
    `${window.location.host} wants you to sign in with your Solana account:`,
    address,
    '',
    'Sign in to lamport-lens (devnet).',
    `Nonce: ${crypto.randomUUID()}`,
    `Issued At: ${new Date().toISOString()}`,
  ].join('\n')

// A Solana address is the Ed25519 public key itself, base58-encoded, so
// verification needs nothing but the message, the signature and the address.
const verify = (message: string, signature: Uint8Array, address: string) =>
  nacl.sign.detached.verify(new TextEncoder().encode(message), signature, bs58.decode(address))

export function SignInPanel() {
  const accounts = useAccounts()
  const { solana } = useSolana()
  const address = (accounts ?? []).find((a) => a.addressType === 'Solana')?.address ?? ''
  const [state, setState] = useState<SignInState>({ status: 'idle' })

  const signIn = async () => {
    const message = buildMessage(address)
    setState({ status: 'signing' })
    try {
      const { signature } = await solana.signMessage(new TextEncoder().encode(message))
      setState({
        status: 'signed',
        message,
        signature,
        verified: verify(message, signature, address),
      })
    } catch (e) {
      const { code, message: msg } = e as { code?: number; message?: string }
      if (code === 4001 || /reject|cancel|denied/i.test(msg ?? '')) {
        setState({ status: 'idle' })
      } else {
        setState({ status: 'failed', message: msg ?? String(e) })
      }
    }
  }

  // Same signature, one character changed: must fail.
  const tamper = () => {
    if (state.status !== 'signed') return
    const message = state.message.replace('Sign in', 'Sign out')
    setState({ ...state, message, verified: verify(message, state.signature, address) })
  }

  if (!address) {
    return (
      <section>
        <h2>5 · Sign in</h2>
        <p className="muted">Connect a wallet first.</p>
      </section>
    )
  }

  return (
    <section>
      <h2>5 · Sign in</h2>
      <div className="row">
        <button disabled={state.status === 'signing'} onClick={signIn}>
          {state.status === 'signing' ? 'Approve in your wallet…' : 'Sign in'}
        </button>
        {state.status === 'signed' && <button onClick={tamper}>Tamper with the message</button>}
      </div>
      {state.status === 'failed' && <p className="error">{state.message}</p>}
      {state.status === 'signed' && (
        <>
          <pre className="muted">{state.message}</pre>
          <p className="muted">
            Signature: <code>{bs58.encode(state.signature)}</code>
          </p>
          <p>{state.verified ? 'Verified ✔' : 'Not verified ✘'}</p>
        </>
      )}
    </section>
  )
}
