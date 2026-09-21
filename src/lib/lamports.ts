// DRILL 2a — money without floats                          [30 min] · DONE ✔
//
// GOAL
//   Convert between on-chain integers and what a human reads, exactly.
//   1 SOL = 1_000_000_000 lamports (9 decimals). USDC has 6 decimals.
//
// RULES
//   bigint and string operations only. No Number(), parseFloat(), or
//   division by 1e9 — floats lose money (0.1 + 0.2 !== 0.3).
//
// DONE WHEN
//   [x] `npm test` → 13 passed

/** 1_500_000_000n → "1.5" · 1n → "0.000000001" · 0n → "0" */
export function formatUnits(amount: bigint, decimals: number): string {
  // padStart guarantees at least one digit before the dot: 1n → "0000000001"
  const withLeftPadding = amount.toString().padStart(decimals + 1, '0')
  const whole = withLeftPadding.slice(0, withLeftPadding.length - decimals)
  const fraction = withLeftPadding.slice(withLeftPadding.length - decimals).replace(/0+$/, '')
  return fraction ? `${whole}.${fraction}` : whole
}

// Digits with at most one dot, and at least one digit: "2", "1.5", ".5", "5."
// Validated up front because BigInt() is lenient: it accepts "", " 1", "-1", "0x10".
const AMOUNT_PATTERN = /^(\d+\.?\d*|\.\d+)$/

/** "1.5" → 1_500_000_000n. Throws on malformed input or too many decimals. */
export function parseUnits(input: string, decimals: number): bigint {
  if (!AMOUNT_PATTERN.test(input)) {
    throw new Error(`Invalid amount: "${input}"`)
  }
  const [whole, fraction = ''] = input.split('.')
  if (fraction.length > decimals) {
    throw new Error(`Too many decimals in "${input}": max ${decimals}`)
  }
  return BigInt((whole || '0') + fraction.padEnd(decimals, '0'))
}
