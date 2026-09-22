// One place for the keys: drill 3 writes into the balance key over
// WebSocket and drill 4 updates it optimistically, so the shape is an API.
export const balanceKey = (address: string) => ['balance', address] as const
export const tokenAccountsKey = (address: string) => ['tokenAccounts', address] as const
