export const supportKeys = {
  all: ['support'] as const,
  tickets: () => [...supportKeys.all, 'tickets'] as const,
  messages: (ticketId: string) => [...supportKeys.all, 'messages', ticketId] as const,
}
