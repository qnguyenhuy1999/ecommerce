import type { MessagesConversationRecord, MessagesMessageRecord } from './Messages.types'

export interface MessagesViewModel {
  selectedConversation: MessagesConversationRecord | undefined
  hasConversations: boolean
  hasMessages: boolean
  canSend: boolean
  conversationTitle: string
}

export function getMessagesViewModel({
  conversations,
  messages,
  selectedConversationId,
  draft,
}: {
  conversations: MessagesConversationRecord[]
  messages: MessagesMessageRecord[]
  selectedConversationId: string | undefined
  draft: string
}): MessagesViewModel {
  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId,
  )

  return {
    selectedConversation,
    hasConversations: conversations.length > 0,
    hasMessages: messages.length > 0,
    canSend: selectedConversationId !== undefined && draft.trim().length > 0,
    conversationTitle: selectedConversation
      ? `Conversation ${selectedConversation.id.slice(0, 8)}`
      : 'Messages',
  }
}
