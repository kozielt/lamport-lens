import { Connection, clusterApiUrl } from '@solana/web3.js'

// Devnet only. Nothing in this app should ever touch mainnet funds.
export const RPC_URL: string = import.meta.env.VITE_RPC_URL ?? clusterApiUrl('devnet')

// Optional. Without it only the injected (extension) provider is offered;
// with it the embedded wallet (Google / Apple login) is offered as well.
// Get one at https://phantom.com/portal
export const PHANTOM_APP_ID: string | undefined = import.meta.env.VITE_PHANTOM_APP_ID || undefined

export const connection = new Connection(RPC_URL, 'confirmed')

export const explorerTxUrl = (signature: string) =>
  `https://explorer.solana.com/tx/${signature}?cluster=devnet`

export const explorerAddressUrl = (address: string) =>
  `https://explorer.solana.com/address/${address}?cluster=devnet`
