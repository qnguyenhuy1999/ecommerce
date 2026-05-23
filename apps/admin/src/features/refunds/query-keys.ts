export const refundKeys = {
  all: ['refunds'] as const,
  lists: () => [...refundKeys.all, 'list'] as const,
  list: (params: { page?: number; limit?: number; status?: string }) =>
    [...refundKeys.lists(), params] as const,
  detail: (id: string) => [...refundKeys.all, 'detail', id] as const,
  statusCounts: () => [...refundKeys.all, 'status-counts'] as const,
}
