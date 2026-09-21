/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PHANTOM_APP_ID?: string
  readonly VITE_RPC_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Set in main.tsx for @solana/web3.js v1.
declare var Buffer: typeof import('buffer/').Buffer
