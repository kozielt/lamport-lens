import { useEffect } from 'react'
import { useAccounts, useConnect, useDisconnect, usePhantom, useSolana } from '@phantom/react-sdk'
import { PHANTOM_APP_ID, explorerAddressUrl } from '../../config'

// Step 1 — connect through the Phantom Connect SDK.
// 'injected' talks to the browser extension; 'google' / 'apple' create an
// embedded wallet and need VITE_PHANTOM_APP_ID (see .env.example).
export function ConnectPanel() {
  const { isConnected } = usePhantom()
  const { connect, isConnecting, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { solana } = useSolana()
  const accounts = useAccounts()

  useEffect(() => {
    if (!isConnected) return
    // The embedded wallet defaults to mainnet. The extension ignores this:
    // there, devnet is a user setting (Settings → Developer Settings).
    solana.switchNetwork('devnet').catch((e) => console.warn('switchNetwork failed', e))
  }, [isConnected, solana])

  if (isConnected) {
    return (
      <section>
        <h2>1 · Connected</h2>
        <ul>
          {accounts?.map((a) => (
            <li key={a.address}>
              {a.addressType}:{' '}
              <a href={explorerAddressUrl(a.address)} target="_blank" rel="noreferrer">
                <code>{a.address}</code>
              </a>
            </li>
          ))}
        </ul>
        <button onClick={() => disconnect()}>Disconnect</button>
      </section>
    )
  }

  return (
    <section>
      <h2>1 · Connect</h2>
      <div className="row">
        <button disabled={isConnecting} onClick={() => connect({ provider: 'injected' })}>
          Phantom extension
        </button>
        {PHANTOM_APP_ID && (
          <button disabled={isConnecting} onClick={() => connect({ provider: 'google' })}>
            Continue with Google
          </button>
        )}
      </div>
      {!PHANTOM_APP_ID && (
        <p className="muted">Set VITE_PHANTOM_APP_ID to enable the embedded wallet (Google login).</p>
      )}
      {error && <p className="error">{error.message}</p>}
    </section>
  )
}
