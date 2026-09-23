# lamport-lens

A devnet playground for the [Phantom Connect SDK](https://docs.phantom.com)
and [`@solana/web3.js`](https://solana-labs.github.io/solana-web3.js/): a small
React app that connects a Phantom wallet and exercises the basic wallet flows
against it.

A _lamport_ is the smallest unit of SOL (1 SOL = 1,000,000,000 lamports).
Amounts stay integers from the RPC response to the screen.

**Devnet only. No real funds, no private keys. Signing happens in the wallet.**

## What's in it

- Connect through the Phantom Connect SDK (browser extension)
- The same connect flow against the raw injected provider (`window.phantom.solana`), without the SDK
- SOL and SPL token balances, fetched with TanStack Query
- Live balance via an `onAccountChange` WebSocket subscription written into the query cache
- Send SOL, modelled as an explicit state machine on React 19 `useActionState`, with an explorer link
- Sign in with a signed message, verified with Ed25519 (tweetnacl)
- Exact money maths on `bigint` (`formatUnits` / `parseUnits`), no floats

[`DX-NOTES.md`](./DX-NOTES.md) collects things that were surprising while
integrating the SDK.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests
npm run build      # typecheck + production build
```

You need the [Phantom extension](https://phantom.com/download) with devnet on:
Settings → Developer Settings → Testnet Mode → Solana Devnet. Free devnet SOL:
<https://faucet.solana.com>.

The extension path needs no developer account. The embedded wallet (Google
login) additionally needs an App ID from [Phantom Portal](https://phantom.com/portal)
in `.env.local` (see `.env.example`). The Portal is not accepting new sign-ups
at the moment, so this build ships extension-only; the code path is in place.

## Stack

React 19 · TypeScript · Vite · TanStack Query · `@phantom/react-sdk` ·
`@solana/web3.js` · Vitest. Deployed to GitHub Pages by
`.github/workflows/deploy.yml` on every push to `main`.

## License

MIT
