import {
  getShopProfile as getShopProfileBase,
  updateShopProfile as updateShopProfileBase,
} from '../integration/seller-page-api'

export async function getShopProfile() {
  const shop = await getShopProfileBase()
  return shop.items
}

export async function updateShopProfile(payload: Record<string, string | undefined>) {
  const response = await updateShopProfileBase(payload)
  return response.data.items
}
