// DRILL 5 — sign in with a signed message                           [45 min]
// Do it: any time after panel 1 works. See it in the "5 · Sign in" box.
//
// GOAL
//   A "Sign in" button makes the wallet sign a text message (no transaction,
//   no fee), then the app verifies the signature and shows "Verified ✔".
//   This is how a dapp proves you own an address.
//
// STEPS
//   1. Address from `useAccounts()` (same as drill 2b); `const { solana } = useSolana()`.
//   2. Build the message — plain text, one field per line, so the user can
//      read it in the wallet popup:
//        const nonce = crypto.randomUUID()
//        const message = [
//          `${window.location.host} wants you to sign in with your Solana account:`,
//          address,
//          '',
//          'Sign in to lamport-lens (devnet).',
//          `Nonce: ${nonce}`,
//          `Issued At: ${new Date().toISOString()}`,
//        ].join('\n')
//   3. Sign:
//        const messageBytes = new TextEncoder().encode(message)
//        const { signature } = await solana.signMessage(messageBytes)   // Uint8Array, 64 bytes
//      try/catch: user closing the popup is not an error state.
//   4. Verify — a Solana address IS the Ed25519 public key, base58-encoded:
//        import nacl from 'tweetnacl'
//        import bs58 from 'bs58'
//        const ok = nacl.sign.detached.verify(messageBytes, signature, bs58.decode(address))
//   5. Show the message, the signature (`bs58.encode(signature)`), and
//      "Verified ✔" / "Not verified ✘".
//   6. Add a "Tamper" button: change one character of the message, verify
//      again with the SAME signature → must show "Not verified ✘".
//
// DONE WHEN
//   [ ] Sign in → wallet popup shows the readable message → "Verified ✔"
//   [ ] Tamper → "Not verified ✘"
//   [ ] Closing the popup leaves the box idle, no error
//
// TALK ALOUD
//   - Why the nonce? Why the domain? Name the attack each one stops.
//   - In a real app verification runs on the server. What does the server
//     store, and when does it throw the nonce away?
//   - Why can't a signed MESSAGE be replayed as a TRANSACTION?
export function SignInPanel() {
  return (
    <section>
      <h2>5 · Sign in</h2>
      <p className="muted">Not built yet — see the comment at the top of SignInPanel.tsx.</p>
    </section>
  )
}
