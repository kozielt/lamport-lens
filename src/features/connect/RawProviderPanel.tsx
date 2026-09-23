// Connect without the SDK: talk straight to the object the Phantom extension
// injects into the page, `window.phantom.solana`.

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
