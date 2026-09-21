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

const trimValue = (value: string) => {
  if (value === '0') {
    return value
  }
  let newValue = value
  while (newValue.startsWith('0') && !newValue.startsWith('0.')) {
    newValue = newValue.slice(1)
  }

  while ((newValue.includes('.') && newValue.endsWith('0')) || newValue.endsWith('.')) {
    if (newValue === '0') {
      return newValue
    }
    newValue = newValue.slice(0, newValue.length - 1)
  }
  return newValue
}

export function formatUnits(amount: bigint, decimals: number): string {
  const stringValue = amount.toString()
  const withLeftPadding = '0'.repeat(decimals) + stringValue
  const withADot = withLeftPadding.slice(0, withLeftPadding.length - decimals) + '.' + withLeftPadding.slice(withLeftPadding.length - decimals)
  return trimValue(withADot)
}

/** "1.5" → 1_500_000_000n. Throws on malformed input or too many decimals. */
export function parseUnits(input: string, decimals: number): bigint {
  const dotIndex = input.indexOf('.')
  const zeroes = '0'.repeat(decimals)
  let newValue = input + zeroes
  console.log('>>>> stuff', newValue)
  if (dotIndex === -1) {
    return BigInt(newValue)
  }
  newValue = newValue.replace('.', '')
  console.log('stuff', trimValue(newValue.slice(0, dotIndex + decimals) + '.' + newValue.slice(dotIndex + decimals)))
  return BigInt(trimValue(newValue.slice(0, dotIndex + decimals) + '.' + newValue.slice(dotIndex + decimals)))
}
