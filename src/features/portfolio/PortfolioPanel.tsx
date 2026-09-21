import { useQuery } from '@tanstack/react-query'
import { useAccounts, usePhantom } from '@phantom/react-sdk'
import { PublicKey } from '@solana/web3.js'
import { connection } from '../../config'
import { formatUnits } from '../../lib/lamports.ts'

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')

const useTokenAccounts = (solanaAddress: string) =>
  useQuery({
    queryKey: ['tokenAccounts', solanaAddress],
    enabled: !!solanaAddress,
    queryFn: async () => {
      const res = await connection.getParsedTokenAccountsByOwner(new PublicKey(solanaAddress), {
        programId: TOKEN_PROGRAM_ID,
      })
      return res.value.map(({ account }) => {
        const info = account.data.parsed.info
        return {
          mint: info.mint as string,
          amount: BigInt(info.tokenAmount.amount),
          decimals: info.tokenAmount.decimals as number,
        }
      })
    },
  })

export function PortfolioPanel() {
  const accounts = useAccounts()
  const { isConnected } = usePhantom()

  const solanaAddress =
    (accounts ?? []).find((account) => account.addressType === 'Solana')?.address ?? ''
  const {
    data: balance,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ['balance', solanaAddress],
    enabled: !!solanaAddress && isConnected,
    queryFn: async () => BigInt(await connection.getBalance(new PublicKey(solanaAddress!))),
  })

  const { data: tokens } = useTokenAccounts(solanaAddress)

  const tokensWithDefault = tokens ?? []

  if (!solanaAddress) {
    return (
      <section>
        <h2>2 · Portfolio</h2>
        <p className="muted">Connect a wallet first.</p>
      </section>
    )
  }

  if (isPending) {
    return (
      <section>
        <h2>2 · Portfolio</h2>
        <p className="muted">Loading...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section>
        <h2>2 · Portfolio</h2>
        <p className="muted">An error has occurred: {error?.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </section>
    )
  }

  return (
    <section>
      <h2>2 · Portfolio</h2>
      <p className="muted">Solana balance: {formatUnits(balance, 9)} SOL.</p>
      {tokensWithDefault.length === 0 ? (
        <p className="muted">No tokens.</p>
      ) : (
        <ul>
          {tokensWithDefault
            .filter((t) => t.amount > 0n)
            .map((t) => (
              <li key={t.mint}>
                {t.mint.slice(0, 4)}…{t.mint.slice(-4)}: {formatUnits(t.amount, t.decimals)}
              </li>
            ))}
        </ul>
      )}
    </section>
  )
}
