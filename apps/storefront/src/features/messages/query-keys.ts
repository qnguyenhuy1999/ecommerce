export const messageKeys = {
  all: ['messages'] as const,
  conversations: () => ['messages', 'conversations'] as const,
  detail: (id: string) => ['messages', 'detail', id] as const,
}
