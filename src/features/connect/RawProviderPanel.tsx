// DRILL 1b — the injected provider, no SDK                          [~45 min]
//
// The Phantom extension injects a provider object into every page at
// `window.phantom.solana` (legacy alias: `window.solana`). The SDK's
// 'injected' mode is a wrapper over this. Build the same connect flow
// against the raw object so you can explain both layers.
//
// Requirements
//  1. Detect the provider (`window.phantom?.solana?.isPhantom`). If it is
//     missing, say so and link to https://phantom.com/download.
//  2. Connect button → `provider.connect()`; show the public key.
//  3. On mount, try `provider.connect({ onlyIfTrusted: true })` so a
//     previously approved site reconnects silently. It rejects when the
//     site is not trusted yet — that is not an error to show.
//  4. Subscribe to 'connect', 'disconnect' and 'accountChanged'; switch the
//     account inside the extension and watch the UI follow. Unsubscribe on
//     unmount.
//  5. Type the provider yourself (a minimal interface + `declare global`),
//     no `any`.
//
// Talk-aloud questions
//  - What can any script on the page do with this object? What can't it do?
//  - Two wallets both want `window.solana`. Who wins, and how does Wallet
//    Standard (and EIP-6963 on the EVM side) fix that?
//  - How does the object get here? (content script → injected script →
//    messages to the extension's background worker)
export function RawProviderPanel() {
  return (
    <section>
      <h2>1b · Raw injected provider</h2>
      <p className="muted">Not built yet — see the comment at the top of RawProviderPanel.tsx.</p>
    </section>
  )
}
