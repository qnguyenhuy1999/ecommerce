import {
  createProduct,
  getProductCategories as getProductCategoriesBase,
  getProductsList,
} from '../integration/seller-page-api'

export async function getProductCategories() {
  const categories = await getProductCategoriesBase()
  return categories.items
}

export { createProduct, getProductsList }
