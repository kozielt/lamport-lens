# DX notes — integrating the Phantom Connect SDK

One entry per thing that was confusing, surprising, broken, or notably good
while integrating the SDK, newest at the bottom. Each entry says what the docs
led to expect, what actually happened, and what would have helped.

Format:

```
## YYYY-MM-DD — short title
Expected: …
Happened: …
Would have helped: …
```

## 2026-09-21 — `appId`: required or not?

Expected: the React SDK docs page says an App ID from Phantom Portal is
required.
Happened: in `@phantom/react-sdk` 2.0.3 the type is `appId?: string`, and the
package README says "required for embedded providers". So an extension-only
(`providers: ['injected']`) app needs no registration at all.
Would have helped: the docs page saying which providers need it.

## 2026-09-21 — `@solana/web3.js` v1 needs a `Buffer` global under Vite

Expected: install and import.
Happened: web3.js v1 assumes Node's `Buffer`; Vite does not polyfill it, and it
stubs out a bare `import 'buffer'` as a Node builtin — the console warns
"Module buffer has been externalized" and the page still renders, so it is easy
to miss. Fix: the `buffer` npm package, `resolve.alias: { buffer: 'buffer/' }`
in `vite.config.ts` (covers dependencies too), and `globalThis.Buffer ??= Buffer`
in `main.tsx`.
Would have helped: a note in the SDK quick start, or examples on `@solana/kit`,
which has no such requirement.

## 2026-09-21 — Phantom Portal: new sign-ups are paused

Expected: register at phantom.com/portal, get an App ID, try the embedded
wallet (Google login) — the SDK's headline feature.
Happened: "New sign ups are paused. The Phantom Developer Portal isn't
accepting new developer accounts right now… email partnerships@phantom.app from
your company email address." An individual developer has no route in.
Meanwhile the docs quick start still opens with "register your app".
Checked the source (`@phantom/browser-sdk` 2.0.3): `appId` is only enforced when
`providers` contains something other than `'injected'`, so the extension path
works with no account at all.
Would have helped: a banner in the docs, and the quick start leading with the
injected-only config, which needs no registration. A public sandbox App ID
limited to devnet would let people evaluate the embedded wallet too.
