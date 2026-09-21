// DRILL 1b — connect WITHOUT the SDK                                [45 min]
// Do it: any time. Easiest drill. See it in the "1b" box on localhost:5173.
//
// GOAL
//   The "1b" box has its own Connect button that talks straight to the object
//   the Phantom extension injects into the page — `window.phantom.solana` —
//   and shows the same address panel 1 shows.
//   (Try it first: open DevTools console and type `window.phantom.solana`.)
//
// STEPS
//   1. Types. At the top of this file write a minimal interface, no `any`:
//        interface PhantomProvider {
//          isPhantom: boolean
//          publicKey: { toString(): string } | null
//          connect(opts?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: { toString(): string } }>
//          disconnect(): Promise<void>
//          on(event: 'connect' | 'disconnect' | 'accountChanged', handler: (arg: unknown) => void): void
//          off(event: 'connect' | 'disconnect' | 'accountChanged', handler: (arg: unknown) => void): void
//        }
//        declare global { interface Window { phantom?: { solana?: PhantomProvider } } }
//   2. Detect. `const provider = window.phantom?.solana`. If it is missing or
//      `!provider.isPhantom`, render "Phantom not installed" with a link to
//      https://phantom.com/download — and stop.
//   3. State. `const [address, setAddress] = useState<string | null>(null)`.
//   4. Connect button → `const { publicKey } = await provider.connect()` →
//      `setAddress(publicKey.toString())`. Wrap in try/catch: when the user
//      closes the popup it throws with `code === 4001` — that is "user said
//      no", go back to idle, show no error.
//   5. Silent reconnect. In a `useEffect` on mount call
//      `provider.connect({ onlyIfTrusted: true })`. It resolves with no popup
//      if this site was approved before, and rejects otherwise — swallow the
//      rejection (`.catch(() => {})`).
//   6. Events. In the same or another `useEffect`:
//        'connect'        → setAddress(provider.publicKey?.toString() ?? null)
//        'disconnect'     → setAddress(null)
//        'accountChanged' → arg is the new publicKey, or null if that account
//                           has not approved this site → set address or null
//      Return a cleanup that calls `provider.off(...)` for each handler.
//   7. Disconnect button → `await provider.disconnect()`.
//
// DONE WHEN
//   [ ] Connect shows the same 9xV3…yKWh address as panel 1
//   [ ] Reload the page → still connected, no popup
//   [ ] Switch account inside the extension → the box follows
//   [ ] Close the approval popup → box is back to idle, no error shown
//   [ ] No `any` in the file; `npm run build` passes
//
// TALK ALOUD
//   - What can any script on this page do with `window.phantom.solana`? What
//     can it NOT do? (Where is the security boundary?)
//   - Two wallets both want `window.solana`. Who wins? How do Wallet Standard
//     (Solana) and EIP-6963 (EVM) fix it?
//   - How did the object get here? (content script → injected script →
//     postMessage → extension background worker)
export function RawProviderPanel() {
  return (
    <section>
      <h2>1b · Raw injected provider</h2>
      <p className="muted">Not built yet — see the comment at the top of RawProviderPanel.tsx.</p>
    </section>
  )
}
