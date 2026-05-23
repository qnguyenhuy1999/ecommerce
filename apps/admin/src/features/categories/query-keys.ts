export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (parentId?: string) => [...categoryKeys.lists(), parentId] as const,
  detail: (id: string) => [...categoryKeys.all, 'detail', id] as const,
}
