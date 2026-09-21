import { describe, expect, it } from 'vitest'
import { formatUnits, parseUnits } from './lamports'

describe('formatUnits', () => {
  it('formats whole amounts without a fraction', () => {
    expect(formatUnits(2_000_000_000n, 9)).toBe('2')
  })
  it('trims trailing zeros', () => {
    expect(formatUnits(1_500_000_000n, 9)).toBe('1.5')
  })
  it('keeps leading zeros in the fraction', () => {
    expect(formatUnits(1n, 9)).toBe('0.000000001')
    expect(formatUnits(1_000_000_001n, 9)).toBe('1.000000001')
  })
  it('handles zero', () => {
    expect(formatUnits(0n, 9)).toBe('0')
  })
  it('handles amounts past Number.MAX_SAFE_INTEGER exactly', () => {
    expect(formatUnits(123_456_789_012_345_678_901n, 9)).toBe('123456789012.345678901')
  })
  it('respects other decimals (USDC = 6)', () => {
    expect(formatUnits(1_250_000n, 6)).toBe('1.25')
  })
  it('handles zero decimals', () => {
    expect(formatUnits(42n, 0)).toBe('42')
  })
})

describe('parseUnits', () => {
  it('parses whole and fractional input', () => {
    expect(parseUnits('2', 9)).toBe(2_000_000_000n)
    expect(parseUnits('1.5', 9)).toBe(1_500_000_000n)
    expect(parseUnits('0.000000001', 9)).toBe(1n)
  })
  it('accepts a bare leading or trailing dot', () => {
    expect(parseUnits('.5', 9)).toBe(500_000_000n)
    expect(parseUnits('5.', 9)).toBe(5_000_000_000n)
  })
  it('is exact where floats are not', () => {
    expect(parseUnits('0.1', 9) + parseUnits('0.2', 9)).toBe(parseUnits('0.3', 9))
  })
  it('round-trips with formatUnits', () => {
    expect(formatUnits(parseUnits('123456789012.345678901', 9), 9)).toBe('123456789012.345678901')
  })
  it('rejects more decimals than the token has', () => {
    expect(() => parseUnits('0.0000000001', 9)).toThrow()
    expect(() => parseUnits('1.5', 0)).toThrow()
  })
  it('rejects malformed input', () => {
    for (const bad of ['', '.', 'abc', '1.2.3', '-1', '1e9', ' 1', '1,5']) {
      expect(() => parseUnits(bad, 9), bad).toThrow()
    }
  })
})
