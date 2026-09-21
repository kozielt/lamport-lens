// DRILL 3 — live balance over WebSocket                             [~60 min]
//
// Polling is the easy answer. Do the push version: the RPC node notifies us
// when the account changes and we write the new value into the React-Query
// cache, so every component reading the balance updates with no refetch.
//
// Requirements
//  1. `connection.onAccountChange(publicKey, (accountInfo) => …, 'confirmed')`
//     returns a subscription id; `accountInfo.lamports` is the new balance.
//  2. On each notification, `queryClient.setQueryData(<drill 2's key>, …)`.
//  3. Clean up with `connection.removeAccountChangeListener(id)` on unmount
//     and when the address changes. StrictMode mounts twice in dev — verify
//     you end with exactly one live subscription (log the ids).
//  4. Show a "live" indicator. What should it say while the socket is down?
//  5. Test it: airdrop from https://faucet.solana.com with the tab open and
//     watch the number move without a reload.
//
// Talk-aloud questions
//  - The socket dropped for 30 s and came back. Is the cached balance
//    right? What do you do on reconnect? (Same as the Parity orderbook: a
//    fresh snapshot, then deltas.)
//  - A refetch resolves *after* a newer push arrived. Which one wins? How
//    would you make that deterministic? (`context.slot`)
//  - 'processed' vs 'confirmed' vs 'finalized' — which should a wallet
//    show, and what does it cost in latency?
//
// Placeholder signature — change it freely.
export function useLiveBalance(_address: string | null): void {
  // not built yet
}
