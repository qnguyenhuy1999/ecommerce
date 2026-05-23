export const promotionKeys = {
  all: ['vouchers'] as const,
  lists: () => [...promotionKeys.all, 'list'] as const,
  list: (params: { page?: number; limit?: number; status?: string; search?: string }) =>
    [...promotionKeys.lists(), params] as const,
  detail: (id: string) => [...promotionKeys.all, 'detail', id] as const,
  statusCounts: () => [...promotionKeys.all, 'status-counts'] as const,
}
