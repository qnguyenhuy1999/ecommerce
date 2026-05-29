import { api } from '../../lib/api'
import type { ChatConversationResponse, ChatMessagesResponse } from '../../lib/storefront-contracts'

export async function markConversationRead(conversationId: string) {
  await api(`/chat/conversations/${conversationId}/read`, { method: 'POST' })
}

export async function startConversation(input: { shopId: string; productId?: string }) {
  const response = await api<ChatConversationResponse>('/chat/conversations', {
    method: 'POST',
    body: JSON.stringify({
      shopId: input.shopId,
      ...(input.productId ? { productId: input.productId } : {}),
    }),
  })

  return response.data
}

export async function sendConversationMessage(conversationId: string, content: string) {
  await api(`/chat/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })

  const response = await api<ChatMessagesResponse>(`/chat/conversations/${conversationId}/messages`)
  return response.data.items
}
