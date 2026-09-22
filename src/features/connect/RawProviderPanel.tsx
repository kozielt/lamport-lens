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

import { useEffect, useState } from 'react'
import { explorerAddressUrl } from '../../config'

// Only what this panel uses. The real object has more (signTransaction,
// signMessage, request, …); the SDK's 'injected' provider wraps it.
type ProviderEvent = 'connect' | 'disconnect' | 'accountChanged'
interface PhantomPublicKey {
  toString(): string
}
interface PhantomProvider {
  isPhantom: boolean
  isConnected: boolean
  publicKey: PhantomPublicKey | null
  connect(opts?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: PhantomPublicKey }>
  disconnect(): Promise<void>
  on(event: ProviderEvent, handler: (arg: unknown) => void): void
  off(event: ProviderEvent, handler: (arg: unknown) => void): void
}

const USER_REJECTED = 4001

// The SDK already declares `window.phantom.solana` as `unknown`, so narrow it
// with a guard instead of redeclaring the global.
const getProvider = (): PhantomProvider | null => {
  const candidate: unknown = window.phantom?.solana
  const isProvider = (v: unknown): v is PhantomProvider =>
    typeof v === 'object' && v !== null && (v as { isPhantom?: boolean }).isPhantom === true
  return isProvider(candidate) ? candidate : null
}

export function RawProviderPanel() {
  const [provider] = useState(getProvider)
  const [address, setAddress] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const connect = async () => {
    if (!provider) return
    setBusy(true)
    try {
      const { publicKey } = await provider.connect()
      setAddress(publicKey.toString())
    } catch (e) {
      // 4001 = the user closed the popup: not an error worth showing.
      if ((e as { code?: number }).code !== USER_REJECTED) console.warn('raw connect failed', e)
    } finally {
      setBusy(false)
    }
  }

  // Silent reconnect: resolves with no popup if this origin was approved
  // before, rejects otherwise — and that rejection is expected, so swallow it.
  useEffect(() => {
    if (!provider) return
    provider
      .connect({ onlyIfTrusted: true })
      .then(({ publicKey }) => setAddress(publicKey.toString()))
      .catch(() => {})
  }, [provider])

  // The extension emits these; without them the UI goes stale the moment the
  // user switches accounts inside the popup.
  useEffect(() => {
    if (!provider) return
    const onConnect = () => setAddress(provider.publicKey?.toString() ?? null)
    const onDisconnect = () => setAddress(null)
    const onAccountChanged = (next: unknown) => {
      // `next` is the new PublicKey, or null when that account has not
      // approved this site yet.
      setAddress(next ? (next as PhantomPublicKey).toString() : null)
    }
    provider.on('connect', onConnect)
    provider.on('disconnect', onDisconnect)
    provider.on('accountChanged', onAccountChanged)
    return () => {
      provider.off('connect', onConnect)
      provider.off('disconnect', onDisconnect)
      provider.off('accountChanged', onAccountChanged)
    }
  }, [provider])

  if (!provider) {
    return (
      <section>
        <h2>1b · Raw injected provider</h2>
        <p className="muted">
          <code>window.phantom.solana</code> not found —{' '}
          <a href="https://phantom.com/download" target="_blank" rel="noreferrer">
            install Phantom
          </a>
          .
        </p>
      </section>
    )
  }

  return (
    <section>
      <h2>1b · Raw injected provider</h2>
      <p className="muted">
        Same wallet, no SDK: this box talks to <code>window.phantom.solana</code> directly.
      </p>
      {address ? (
        <>
          <p>
            <a href={explorerAddressUrl(address)} target="_blank" rel="noreferrer">
              <code>{address}</code>
            </a>
          </p>
          <button disabled={busy} onClick={() => provider.disconnect()}>
            Disconnect
          </button>
        </>
      ) : (
        <button disabled={busy} onClick={() => connect()}>
          Connect via window.phantom.solana
        </button>
      )}
    </section>
  )
}
