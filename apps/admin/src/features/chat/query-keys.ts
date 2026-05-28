export const chatKeys = {
  all: ['chat'] as const,
  chats: () => [...chatKeys.all, 'chats'] as const,
  messages: (chatId: string) => [...chatKeys.all, 'messages', chatId] as const,
}
