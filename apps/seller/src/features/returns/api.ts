import { getReturns as getReturnsBase, updateReturnStatus } from '../integration/seller-page-api'

export async function getReturns(limit?: number, init?: RequestInit) {
  const returns = await getReturnsBase(limit, init)
  return returns.items
}

export { updateReturnStatus }
