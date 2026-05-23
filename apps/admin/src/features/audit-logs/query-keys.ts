export const auditLogKeys = {
  all: ['audit-logs'] as const,
  lists: () => [...auditLogKeys.all, 'list'] as const,
  list: (params: { page?: number; limit?: number; action?: string }) =>
    [...auditLogKeys.lists(), params] as const,
}
