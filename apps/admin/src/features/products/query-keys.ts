import type { ProductListQuery } from './api/products.api'

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ProductListQuery) => [...productKeys.lists(), params] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
  statusCounts: () => [...productKeys.all, 'status-counts'] as const,
}
