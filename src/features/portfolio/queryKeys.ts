// One place for the keys: the WebSocket subscription writes into the balance
// key and the send flow may update it optimistically, so the shape is an API.
export const balanceKey = (address: string) => ['balance', address] as const
export const tokenAccountsKey = (address: string) => ['tokenAccounts', address] as const
