import type { SellersListQuery } from './api/sellers.api'

export const sellerKeys = {
  all: ['sellers'] as const,
  lists: () => [...sellerKeys.all, 'list'] as const,
  list: (params: SellersListQuery) => [...sellerKeys.lists(), params] as const,
  detail: (id: string) => [...sellerKeys.all, 'detail', id] as const,
  statusCounts: () => [...sellerKeys.all, 'status-counts'] as const,
}
