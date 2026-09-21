// DRILL 2a — money without floats                                   [~30 min]
//
// 1 SOL = 1_000_000_000 lamports. Balances arrive as integers and must stay
// integers: `lamports / 1e9` is a float, and 0.1 + 0.2 !== 0.3.
// Implement both functions with bigint and string operations only — no
// Number(), parseFloat() or division by 1e9 anywhere.
//
// Run: npm test            (src/lib/lamports.test.ts — every test fails now)
//
// The same two functions work for any SPL token: `decimals` is 9 for SOL,
// 6 for USDC.

/** 1_500_000_000n → "1.5" · 1n → "0.000000001" · 0n → "0" */
export function formatUnits(_amount: bigint, _decimals: number): string {
  return 'TODO'
}

/** "1.5" → 1_500_000_000n. Throws on malformed input or too many decimals. */
export function parseUnits(_input: string, _decimals: number): bigint {
  return -1n
}
