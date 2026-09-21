# lamport-lens

A small, devnet-only Solana wallet dashboard built on the
[Phantom Connect SDK](https://docs.phantom.com). It is a learning project: I
am a frontend engineer coming from real-time trading UIs, and this is where I
learn how the same problems — streaming state, exact money maths, optimistic
UI over a slow backend — look on a blockchain.

A _lamport_ is the smallest unit of SOL (1 SOL = 1,000,000,000 lamports).
Every amount in this app stays an integer from the RPC response to the screen.

**Devnet only. No real funds, no private keys — signing happens in the wallet.**

## What it does

| #   | Feature                                                                                   | Status      |
| --- | ----------------------------------------------------------------------------------------- | ----------- |
| 1   | Connect through the Phantom Connect SDK (browser extension)                               | done        |
| 2a  | Exact money maths: `formatUnits` / `parseUnits` on `bigint`, no floats, 13 tests          | done        |
| 2b  | Portfolio: SOL and SPL token balances with React-Query                                    | in progress |
| 4   | Send flow as an explicit state machine, optimistic balance with rollback, expiry handling | todo        |
| 3   | Live balance: `onAccountChange` WebSocket subscription written into the React-Query cache | todo        |
| 1b  | The same connect flow against the raw injected provider (`window.phantom.solana`), no SDK | todo        |
| 5   | Sign in with a signed message, Ed25519 verification with tweetnacl                        | todo        |

Rows are in build order. Each feature's file starts with its task statement:
goal, steps, a done-when checklist, and questions to answer out loud.
[`DX-NOTES.md`](./DX-NOTES.md) is my running log of what was confusing or
surprising while integrating the SDK.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests (money maths)
npm run build      # typecheck + production build
```

You need the [Phantom extension](https://phantom.com/download) with devnet on:
Settings → Developer Settings → Testnet Mode → Solana Devnet. Free devnet SOL:
<https://faucet.solana.com>.

Everything here runs against the extension alone, with no developer account.
The embedded wallet (Google login) additionally needs an App ID from
[Phantom Portal](https://phantom.com/portal) in `.env.local` (see
`.env.example`). As of September 2026 the Portal has paused new sign-ups, so
this build ships extension-only; the code path is in place for when it reopens.

## Stack

React 19 · TypeScript · Vite · TanStack Query · `@phantom/react-sdk` ·
`@solana/web3.js` · Vitest. Deployed to GitHub Pages by
`.github/workflows/deploy.yml` on every push to `main`.

## License

MIT
