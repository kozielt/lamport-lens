// DRILL 4 — send flow as a state machine                            [~75 min]
//
// Send SOL on devnet to another address and show the truth about what is
// happening at every moment. This is the drill closest to real wallet work.
//
// Requirements
//  1. Form: recipient (validate: `new PublicKey(input)` throws on garbage)
//     and amount (parseUnits → bigint lamports; reject more than balance
//     minus fee).
//  2. Build the transaction: `connection.getLatestBlockhash()` gives
//     `{ blockhash, lastValidBlockHeight }`; `SystemProgram.transfer`;
//     set `feePayer` and `recentBlockhash`.
//  3. `solana.signAndSendTransaction(tx)` from useSolana() → `{ signature }`.
//  4. Model the lifecycle explicitly — a reducer or a discriminated union,
//     not a pile of booleans:
//       idle → signing → sent → confirmed → finalized
//                 ↘ rejected     ↘ failed   ↘ expired
//     Make impossible states unrepresentable (no signature before 'sent';
//     no error message outside the failure states).
//  5. Confirm with `connection.confirmTransaction({ signature, blockhash,
//     lastValidBlockHeight })`, which resolves on confirmation and rejects
//     once the block height passes lastValidBlockHeight ('expired').
//  6. Optimistic UI: subtract the amount from the cached balance the moment
//     the transaction is sent, and roll back on failed / expired. Think
//     about how this interacts with drill 3 writing to the same cache key.
//  7. Link the signature to the explorer (explorerTxUrl in config.ts).
//
// Break it on purpose, and write down what the user sees each time:
//  - reject in the wallet popup
//  - send more than the balance
//  - send to a fresh address below the rent-exempt minimum (~0.00089 SOL)
//  - build the tx, wait ~2 minutes, then sign → blockhash expired
//  - go offline between 'sent' and 'confirmed'
//
// Talk-aloud questions
//  - The UI showed success optimistically and the tx failed. What now?
//  - A transaction is 'sent' and the user closes the tab. What do they see
//    when they come back? Where would that state have to live?
//  - Why does Solana expire transactions at all, where Ethereum has nonces?
//  - Write tests for the reducer first. Which transitions are illegal?
export function SendPanel() {
  return (
    <section>
      <h2>4 · Send</h2>
      <p className="muted">Not built yet — see the comment at the top of SendPanel.tsx.</p>
    </section>
  )
}
