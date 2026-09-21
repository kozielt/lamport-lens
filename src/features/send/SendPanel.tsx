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
//        type TxState =
//          | { status: 'idle' }
//          | { status: 'signing' }
//          | { status: 'sent'; signature: string }
//          | { status: 'confirmed'; signature: string }
//          | { status: 'rejected' }                              // user closed popup
//          | { status: 'failed'; message: string; signature?: string }
//          | { status: 'expired'; signature: string }
//      `const [tx, setTx] = useState<TxState>({ status: 'idle' })`
//   2. Form: recipient input, amount input, Send button (disabled unless
//      status is idle/confirmed/rejected/failed/expired).
//   3. Validate on submit, show the message next to the field:
//        recipient: try { new PublicKey(recipient) } catch → "Invalid address"
//        amount:    try { parseUnits(amount, 9) } catch (e) → e.message
//                   amount > 0n, and amount + 5000n (fee) <= balance
//   4. Build:
//        const from = new PublicKey(address)
//        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
//        const transaction = new Transaction({ feePayer: from, blockhash, lastValidBlockHeight })
//          .add(SystemProgram.transfer({ fromPubkey: from, toPubkey: to, lamports: amount }))
//   5. Sign + send — `const { solana } = useSolana()`:
//        setTx({ status: 'signing' })
//        const { signature } = await solana.signAndSendTransaction(transaction)
//        setTx({ status: 'sent', signature })
//      If it throws with `code === 4001` or a "rejected" message →
//      `{ status: 'rejected' }`. Anything else → 'failed'.
//   6. Confirm:
//        const res = await connection.confirmTransaction(
//          { signature, blockhash, lastValidBlockHeight }, 'confirmed')
//        res.value.err ? 'failed' : 'confirmed'
//      It THROWS `TransactionExpiredBlockheightExceededError` when the
//      blockhash expires (~60–90 s) → `{ status: 'expired', signature }`.
//   7. Render every state. From 'sent' onward show a link:
//      `explorerTxUrl(signature)` from ../../config.
//   8. Optimistic balance: on 'sent',
//        queryClient.setQueryData(balanceKey, (old: bigint) => old - amount - 5000n)
//      on 'failed' / 'expired', `queryClient.invalidateQueries({ queryKey: balanceKey })`
//      to pull the real number back.
//
// DONE WHEN
//   [ ] Send 0.1 SOL to Account 2 → box goes signing → sent → confirmed, the
//       explorer link opens the transaction, Portfolio balance drops
//   [ ] Close the wallet popup → 'rejected', form usable again, no error text
//   [ ] Amount larger than the balance → blocked before the wallet opens
//   [ ] Garbage recipient → "Invalid address"
//   [ ] `TxState` makes it impossible to have a signature while 'signing'
//
// BREAK IT ON PURPOSE (write what the user sees into DX-NOTES.md)
//   - Send 0.0001 SOL to a brand-new empty address (below the rent-exempt
//     minimum ≈ 0.00089 SOL) → what error comes back?
//   - Go offline between 'sent' and 'confirmed'.
//   - Temporarily skip step 3 and send more than you have.
//
// TALK ALOUD
//   - The UI showed success optimistically and the tx failed. What now?
//   - Status is 'sent' and the user closes the tab. What do they see when
//     they come back? Where would that state have to live?
//   - Why does Solana expire transactions, where Ethereum uses nonces?
export function SendPanel() {
  return (
    <section>
      <h2>4 · Send</h2>
      <p className="muted">Not built yet — see the comment at the top of SendPanel.tsx.</p>
    </section>
  )
}
