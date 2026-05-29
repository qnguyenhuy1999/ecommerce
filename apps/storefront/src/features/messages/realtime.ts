import type { ChatConversation } from '../../lib/storefront-contracts'
import type { RealtimeChatMessagePayload } from '../../lib/realtime'
import type { ChatMessageState } from './types'

export function sortConversations(conversations: ChatConversation[]) {
  return [...conversations].sort((left, right) => {
    const leftTime = left.lastMessageAt ? new Date(left.lastMessageAt).getTime() : 0
    const rightTime = right.lastMessageAt ? new Date(right.lastMessageAt).getTime() : 0
    return rightTime - leftTime
  })
}

export function getUnreadCount(conversations: ChatConversation[]) {
  return conversations.reduce((sum, conversation) => sum + conversation.buyerUnread, 0)
}

export function appendMessage(messages: ChatMessageState[], incoming: ChatMessageState) {
  if (messages.some((message) => message.id === incoming.id)) {
    return messages
  }

  return [...messages, incoming]
}

export function getSelectedConversationId(
  currentConversationId: string | undefined,
  conversations: ChatConversation[],
) {
  return currentConversationId &&
    conversations.some((conversation) => conversation.id === currentConversationId)
    ? currentConversationId
    : conversations[0]?.id
}

export function markConversationReadState(
  conversations: ChatConversation[],
  conversationId: string,
) {
  return conversations.map((conversation) =>
    conversation.id === conversationId ? { ...conversation, buyerUnread: 0 } : conversation,
  )
}

export function applyIncomingConversationUpdate(
  conversations: ChatConversation[],
  incoming: RealtimeChatMessagePayload,
  selectedConversationId: string,
) {
  return sortConversations(
    conversations.map((conversation) =>
      conversation.id === incoming.conversationId
        ? {
            ...conversation,
            lastMessageText: incoming.content,
            lastMessageAt: incoming.createdAt,
            buyerUnread:
              incoming.conversationId === selectedConversationId ? 0 : conversation.buyerUnread + 1,
          }
        : conversation,
    ),
  )
}
