// DRILL 2b — portfolio view with React-Query                        [~60 min]
//
// Show what the connected address holds on devnet.
//
// Requirements
//  1. SOL balance: `connection.getBalance(publicKey)` → lamports. Convert to
//     bigint at the boundary, render with formatUnits from lib/lamports.ts.
//  2. Token accounts: `connection.getParsedTokenAccountsByOwner(publicKey,
//     { programId: TOKEN_PROGRAM_ID })`. One row per account: mint
//     (shortened), amount (the RPC gives a string `amount` plus `decimals` —
//     use those, never `uiAmount`, which is a float). Hide zero balances.
//     TOKEN_PROGRAM_ID = TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
//  3. Both reads are `useQuery` calls. Decide the query keys before typing
//     anything — drill 3 writes into this cache, so the key is an API.
//  4. Four visible states: loading, error (with retry), empty, data.
//  5. Nothing fetches while disconnected (`enabled`).
//
// Need tokens to look at? https://faucet.solana.com for SOL, and
// https://spl-token-faucet.com or `spl-token create-token` for an SPL token.
//
// Talk-aloud questions
//  - staleTime vs gcTime: what should each be for a balance? Why?
//  - Why is a token balance a separate *account* and not a field on yours?
//    What is an associated token account, and who pays rent for it?
//  - Apollo's normalized cache vs React-Query's key cache: what did you get
//    for free at Parity that you have to do by hand here?
export function PortfolioPanel() {
  return (
    <section>
      <h2>2 · Portfolio</h2>
      <p className="muted">Not built yet — see the comment at the top of PortfolioPanel.tsx.</p>
    </section>
  )
}
