export const messageKeys = {
  all: ['messages'] as const,
  conversations: (search?: string) => ['messages', 'conversations', search] as const,
  detail: (id: string) => ['messages', 'detail', id] as const,
}
