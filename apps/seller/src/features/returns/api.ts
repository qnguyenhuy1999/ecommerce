import { getReturns as getReturnsBase, updateReturnStatus } from '../integration/seller-page-api'

export async function getReturns(limit?: number) {
  const returns = await getReturnsBase(limit)
  return returns.items
}

export { updateReturnStatus }
