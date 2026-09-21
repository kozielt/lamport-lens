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
export function useLiveBalance(_address: string | null): void {
  // not built yet
}
