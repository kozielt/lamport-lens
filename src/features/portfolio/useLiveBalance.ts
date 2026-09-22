// DRILL 3 — live balance over WebSocket                             [45 min]
// Do it: after 2b. No new box — the balance in "2 · Portfolio" starts
// updating by itself.
//
// GOAL
//   When the wallet's balance changes on-chain, the number in the Portfolio
//   box changes within a couple of seconds, with no reload and no polling.
//
// STEPS
//   1. In this hook: `const queryClient = useQueryClient()`.
//   2. `useEffect(() => { … }, [address, queryClient])`. Return early when
//      `address` is null/empty.
//   3. Subscribe — the RPC node pushes every change to this account:
//        const id = connection.onAccountChange(
//          new PublicKey(address),
//          (accountInfo) => {
//            queryClient.setQueryData(['balance', address], BigInt(accountInfo.lamports))
//          },
//          'confirmed',
//        )
//      The key must be exactly the key drill 2b reads (import it from
//      queryKeys.ts).
//   4. Cleanup: `return () => { connection.removeAccountChangeListener(id) }`.
//   5. Call `useLiveBalance(address)` inside PortfolioPanel.
//   6. Test it. With the page open, run in a terminal:
//        curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" \
//          -d '{"jsonrpc":"2.0","id":1,"method":"requestAirdrop","params":["<YOUR_ADDRESS>",100000000]}'
//      (or use https://faucet.solana.com). The number should move by 0.1.
//
// DONE WHEN
//   [ ] Airdrop with the tab open → balance updates without a reload
//   [ ] Log the subscription ids: after mount in dev (StrictMode mounts
//       twice) exactly ONE subscription is alive
//   [ ] Switching account re-subscribes to the new address
//
// TALK ALOUD
//   - The socket drops for 30 s and reconnects. Is the cached number right?
//     What do you do on reconnect? (Parity orderbook: snapshot, then deltas.)
//   - A slow refetch resolves AFTER a newer push. Which wins? How would you
//     make it deterministic? (compare `context.slot`)
//   - 'processed' vs 'confirmed' vs 'finalized': which does a wallet show?

import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { connection } from '../../config'
import { balanceKey } from './queryKeys'

/**
 * Keeps the cached SOL balance for `address` current by subscribing to
 * account changes over the RPC WebSocket and writing every notification
 * straight into the React-Query cache. Returns whether a subscription is live.
 */
export function useLiveBalance(address: string | null): boolean {
  const queryClient = useQueryClient()
  const [liveFor, setLiveFor] = useState<string | null>(null)

  useEffect(() => {
    if (!address) return

    // `accountSubscribe` under the hood: the node pushes the full account
    // (lamports, owner, data) each time it changes at the given commitment.
    const id = connection.onAccountChange(
      new PublicKey(address),
      (accountInfo) => {
        queryClient.setQueryData(balanceKey(address), BigInt(accountInfo.lamports))
      },
      'confirmed',
    )
    // The socket connects lazily; the first notification proves it is up.
    const markLive = () => setLiveFor(address)
    connection
      .getAccountInfo(new PublicKey(address))
      .then(markLive)
      .catch(() => {})

    // StrictMode mounts twice in dev: the cleanup runs between, so exactly one
    // subscription survives. Log the ids to see it.
    return () => {
      connection.removeAccountChangeListener(id).catch(() => {})
    }
  }, [address, queryClient])

  // Derived, not synced: live only while the subscription for THIS address exists.
  return liveFor === address
}
