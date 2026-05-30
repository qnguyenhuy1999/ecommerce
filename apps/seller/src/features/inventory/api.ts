import { getInventory as getInventoryBase } from '../integration/seller-page-api'

export function getInventory(init?: RequestInit) {
  return getInventoryBase(undefined, init)
}
