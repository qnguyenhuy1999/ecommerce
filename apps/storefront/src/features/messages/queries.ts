import { api } from '../../lib/api'
import type {
  ChatConversationsResponse,
  ChatMessagesResponse,
} from '../../lib/storefront-contracts'

export async function getConversations() {
  const response = await api<ChatConversationsResponse>('/chat/conversations')
  return response.data.items
}

export async function getConversationMessages(conversationId: string) {
  const response = await api<ChatMessagesResponse>(`/chat/conversations/${conversationId}/messages`)
  return response.data.items
}
