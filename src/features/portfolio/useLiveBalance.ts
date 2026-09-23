// Live balance over WebSocket: when the wallet's balance changes on-chain the
// number in the Portfolio panel updates within a couple of seconds, with no
// reload and no polling.

import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { connection } from '../../config'
import { balanceKey } from './queryKeys'

/**
 * Keeps the cached SOL balance for `address` current by subscribing to
 * account changes over the RPC WebSocket and writing every notification
 * straight into the React-Query cache. Returns whether a subscription is live.
 */
export function useLiveBalance(address: string | null): boolean {
  const queryClient = useQueryClient()
  const [liveFor, setLiveFor] = useState<string | null>(null)

  useEffect(() => {
    if (!address) return

    // `accountSubscribe` under the hood: the node pushes the full account
    // (lamports, owner, data) each time it changes at the given commitment.
    const id = connection.onAccountChange(
      new PublicKey(address),
      (accountInfo) => {
        queryClient.setQueryData(balanceKey(address), BigInt(accountInfo.lamports))
      },
      'confirmed',
    )
    // The socket connects lazily; the first notification proves it is up.
    const markLive = () => setLiveFor(address)
    connection
      .getAccountInfo(new PublicKey(address))
      .then(markLive)
      .catch(() => {})

    // StrictMode mounts twice in dev: the cleanup runs between, so exactly one
    // subscription survives. Log the ids to see it.
    return () => {
      connection.removeAccountChangeListener(id).catch(() => {})
    }
  }, [address, queryClient])

  // Derived, not synced: live only while the subscription for THIS address exists.
  return liveFor === address
}
