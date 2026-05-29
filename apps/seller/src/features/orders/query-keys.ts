export const orderKeys = {
  all: ['orders'] as const,
  list: (params: Record<string, unknown>) => ['orders', 'list', params] as const,
  detail: (id: string) => ['orders', 'detail', id] as const,
  statusCounts: () => ['orders', 'statusCounts'] as const,
}
