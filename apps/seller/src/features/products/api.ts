import {
  createProduct,
  getProductCategories as getProductCategoriesBase,
  getProductsList as getProductsListBase,
} from '../integration/seller-page-api'

export async function getProductCategories(init?: RequestInit) {
  const categories = await getProductCategoriesBase(init)
  return categories.items
}

export function getProductsList(
  params: { limit?: number; page?: number; search?: string; status?: string } = {},
  init?: RequestInit,
) {
  return getProductsListBase(params, init)
}

export { createProduct }
