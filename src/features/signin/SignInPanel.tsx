// DRILL 5 — sign in with a signed message                           [~45 min]
//
// Prove control of an address without sending a transaction: sign a message,
// verify the signature. This is the primitive behind "Sign In With Solana".
//
// Requirements
//  1. Build a message a human can read in the wallet popup: the domain
//     (window.location.host), the address, a statement, a random nonce and
//     an issued-at timestamp. One field per line.
//  2. `solana.signMessage(message)` from useSolana() → `{ signature }`
//     (Uint8Array, 64 bytes).
//  3. Verify locally: `nacl.sign.detached.verify(messageBytes, signature,
//     publicKeyBytes)` with tweetnacl. A Solana address *is* the Ed25519
//     public key, base58-encoded — `bs58.decode(address)` gives the 32 bytes.
//  4. Show verified / not verified. Then flip one character of the message
//     and verify again — it must fail.
//
// Talk-aloud questions
//  - Why the nonce? Why the domain? Describe the attack each one stops.
//  - In a real app the verify step runs on the server. What does the server
//    store, and when does it invalidate the nonce?
//  - Why can't a signed *message* be replayed as a *transaction*?
//  - Ed25519 here, secp256k1 on Ethereum. Ethereum can recover the address
//    from a signature alone; Solana cannot. Why not?
export function SignInPanel() {
  return (
    <section>
      <h2>5 · Sign in</h2>
      <p className="muted">Not built yet — see the comment at the top of SignInPanel.tsx.</p>
    </section>
  )
}
