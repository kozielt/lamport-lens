// Trailing slash: the npm package, not the Node builtin that Vite stubs out.
import { Buffer } from 'buffer/'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AddressType, PhantomProvider, type PhantomSDKConfig } from '@phantom/react-sdk'
import { PHANTOM_APP_ID } from './config'
import './index.css'
import App from './App.tsx'

// @solana/web3.js v1 expects a global Buffer, which browsers don't have.
globalThis.Buffer ??= Buffer

const queryClient = new QueryClient()

const phantomConfig: PhantomSDKConfig = {
  providers: PHANTOM_APP_ID ? ['injected', 'google', 'apple'] : ['injected'],
  addressTypes: [AddressType.solana],
  appId: PHANTOM_APP_ID,
  // Must be whitelisted for the app in Phantom Portal.
  authOptions: { redirectUrl: `${window.location.origin}${import.meta.env.BASE_URL}` },
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PhantomProvider config={phantomConfig} appName="lamport-lens">
        <App />
      </PhantomProvider>
    </QueryClientProvider>
  </StrictMode>,
)
