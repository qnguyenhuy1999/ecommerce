export interface ChatRealtimeChatLike {
  id: string
  lastMessageText?: unknown
  updatedAt: string
}

export interface ChatRealtimeMessageLike {
  id: string
  conversationId: string
  content: string
  createdAt: string
}

export function sortChatsByLastMessage<T extends ChatRealtimeChatLike>(chats: T[]): T[] {
  return [...chats].sort(
    (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  )
}

export function applyIncomingMessageToChats<
  TChat extends ChatRealtimeChatLike,
  TMessage extends ChatRealtimeMessageLike,
>(current: TChat[], incoming: TMessage): TChat[] {
  const updated = current.map((chat) =>
    chat.id === incoming.conversationId
      ? {
          ...chat,
          lastMessageText: incoming.content,
          updatedAt: incoming.createdAt,
        }
      : chat,
  )

  return sortChatsByLastMessage(updated)
}

export function insertChatIntoList<T extends ChatRealtimeChatLike>(current: T[], incoming: T): T[] {
  const withoutExisting = current.filter((chat) => chat.id !== incoming.id)
  return sortChatsByLastMessage([incoming, ...withoutExisting])
}

export function mergeIncomingChatMessage<T extends ChatRealtimeMessageLike>(
  current: T[],
  incoming: T,
): T[] {
  return current.some((message) => message.id === incoming.id) ? current : [...current, incoming]
}
