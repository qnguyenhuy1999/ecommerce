import { productsColumns } from './Products.columns'
import { productStatusTabs } from './Products.fixtures'
import type { ProductRow, ProductsFilterParams, ProductsStatusTab } from './Products.types'

export { productsColumns }

export function isProductsStatusTab(value: string): value is ProductsStatusTab {
  return productStatusTabs.some((tab) => tab === value)
}

export function buildProductStatusCounts(
  products: ProductRow[],
): Record<ProductsStatusTab, number> {
  const counts: Record<ProductsStatusTab, number> = {
    ALL: 0,
    LIVE: 0,
    DRAFT: 0,
    OUT_OF_STOCK: 0,
    PENDING: 0,
    BLOCKED: 0,
    SCHEDULED: 0,
  }

  for (const product of products) {
    counts.ALL += 1
    counts[product.status] += 1
  }

  return counts
}

export function filterProductsBySearchAndStatus({
  products,
  search,
  status,
}: ProductsFilterParams): ProductRow[] {
  const query = search.trim().toLowerCase()

  return products.filter((product) => {
    const matchesStatus = status === 'ALL' || product.status === status
    const matchesSearch =
      query.length === 0 ||
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)

    return matchesStatus && matchesSearch
  })
}
