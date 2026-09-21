// DRILL 2b — portfolio panel with React-Query                       [60 min]
// Do it: after 2a. See it in the "2 · Portfolio" box on localhost:5173
// (connect in panel 1 first).
//
// GOAL
//   The box shows the connected wallet's SOL balance ("5 SOL") and a list of
//   the tokens it holds.
//
// STEPS — part B, token list
//   6. Second query, key ['tokenAccounts', address], same `enabled`:

//      Never use `tokenAmount.uiAmount` — it is a float.
//   7. Render one row per token: shortened mint (`EPjF…Dt1v`) and
//      `formatUnits(amount, decimals)`. Hide rows where amount === 0n.
//   8. Empty state: "No tokens". (Your wallet has none yet — to get one, use
//      https://spl-token-faucet.com on devnet.)
//   9. Move the two query keys into `queryKeys.ts` in this folder and export
//      them — drills 3 and 4 write into the balance key.
//
// DONE WHEN
//   [x] Box shows the balance, matching the extension
//   [x] Disconnect in panel 1 → "Connect a wallet first", not "Loading…"
//   [x] Balance reads "5 SOL" (unit shown)
//   [x] Error state has a working Retry (test: put
//       VITE_RPC_URL=https://bad.example.com in .env.local, restart dev,
//       see the error + button, then delete the file)
//   [ ] Token list renders, or shows "No tokens"
//   [ ] Switch account in the extension → the other account's balance
//
// TALK ALOUD
//   - staleTime for a balance: what number, and why?
//   - Why is a token balance a separate account, not a field on yours?
//   - Apollo's normalized cache vs React-Query's key cache: what did Apollo
//     do for you at Parity that you do by hand here?
// import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAccounts } from '@phantom/react-sdk'
import { PublicKey } from '@solana/web3.js'
import { usePhantom } from '@phantom/react-sdk'
import { connection } from '../../config'
import { formatUnits } from '../../lib/lamports.ts'

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')

const useTokenAccounts = (solanaAddress: string) =>
  useQuery({
    queryKey: ['tokenAccounts', solanaAddress],
    enabled: !!solanaAddress,
    queryFn: async () => {
      const res = await connection.getParsedTokenAccountsByOwner(new PublicKey(solanaAddress), {
        programId: TOKEN_PROGRAM_ID,
      })
      return res.value.map(({ account }) => {
        const info = account.data.parsed.info
        return {
          mint: info.mint as string,
          amount: BigInt(info.tokenAmount.amount),
          decimals: info.tokenAmount.decimals as number,
        }
      })
    },
  })

export function PortfolioPanel() {
  const accounts = useAccounts()
  const { isConnected } = usePhantom()

  const solanaAddress =
    (accounts ?? []).find((account) => account.addressType === 'Solana')?.address ?? ''
  const {
    data: balance,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ['balance', solanaAddress],
    enabled: !!solanaAddress && isConnected,
    queryFn: async () => BigInt(await connection.getBalance(new PublicKey(solanaAddress!))),
  })

  const { data: tokens } = useTokenAccounts(solanaAddress)

  const tokensWithDefault = tokens ?? []

  if (!solanaAddress) {
    return (
      <section>
        <h2>2 · Portfolio</h2>
        <p className="muted">Connect a wallet first.</p>
      </section>
    )
  }

  if (isPending) {
    return (
      <section>
        <h2>2 · Portfolio</h2>
        <p className="muted">Loading...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section>
        <h2>2 · Portfolio</h2>
        <p className="muted">An error has occurred: {error?.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </section>
    )
  }

  return (
    <section>
      <h2>2 · Portfolio</h2>
      <p className="muted">Solana balance: {formatUnits(balance, 9)}SOL.</p>
      {tokensWithDefault.length === 0 ? (
        <p className="muted">No tokens.</p>
      ) : (
        <ul>
          {tokensWithDefault
            .filter((t) => t.amount > 0n)
            .map((t) => (
              <li key={t.mint}>
                {t.mint.slice(0, 4)}…{t.mint.slice(-4)}: {formatUnits(t.amount, t.decimals)}
              </li>
            ))}
        </ul>
      )}
    </section>
  )
}
