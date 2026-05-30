import { api } from '@/lib/api'
import type { AdminComponents, AdminOperations } from '@ecom/contracts/generated'

export type ChatSummaryDto = AdminComponents['schemas']['ChatConversationSummaryDto']
export type ChatDetailDto = AdminComponents['schemas']['ChatConversationDetailDto']
export type ChatMessageDto = AdminComponents['schemas']['ChatMessageDto']
export type CreateChatConversationBody = {
  buyerId: string
  shopId: string
  productId?: string
}

export type ChatsResponse =
  AdminOperations['ChatController_listConversations']['responses']['200']['content']['application/json']

export type ChatConversationResponse = {
  success: boolean
  data: ChatSummaryDto
}

export type ChatMessagesResponse =
  AdminOperations['ChatController_getMessages']['responses']['200']['content']['application/json']

export async function getChats() {
  return api<ChatsResponse>('/admin/chat/conversations')
}

export async function createChatConversation(body: CreateChatConversationBody) {
  return api<ChatConversationResponse>('/admin/chat/conversations', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function getChatMessages(chatId: string) {
  return api<ChatMessagesResponse>(`/admin/chat/conversations/${chatId}/messages`)
}
