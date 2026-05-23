import type { UserListQuery } from './api/users.api'

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: UserListQuery) => [...userKeys.lists(), params] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
  statusCounts: () => [...userKeys.all, 'status-counts'] as const,
}
