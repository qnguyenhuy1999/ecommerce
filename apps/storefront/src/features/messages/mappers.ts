import { formatDateTime } from '@ecom/shared/utils/format'
import type { MessageConversation, MessageEntry } from '@ecom/ui-storefront/pages/Messages'
import type { ChatConversation, ChatMessagesResponse } from '../../lib/storefront-contracts'
import type { RealtimeChatMessagePayload } from '../../lib/realtime'
import type { ChatMessageState } from './types'

export function mapConversation(conversation: ChatConversation): MessageConversation {
  const shopIdShort = conversation.shopId.slice(0, 8)

  return {
    id: conversation.id,
    buyerName: `Shop ${shopIdShort}`,
    buyerInitials: 'SH',
    shopIdLabel: `Shop ${shopIdShort}`,
    ...(conversation.lastMessageText ? { lastMessagePreview: conversation.lastMessageText } : {}),
    ...(conversation.lastMessageAt ? { lastActivityAt: conversation.lastMessageAt } : {}),
    unreadCount: conversation.buyerUnread,
  }
}

export function mapMessage(message: ChatMessageState): MessageEntry {
  return {
    id: message.id,
    sender: 'BUYER',
    content: message.content,
    sentAtLabel: formatDateTime(message.createdAt),
  }
}

export function toRealtimeMessage(payload: RealtimeChatMessagePayload): ChatMessageState {
  return {
    id: payload.id,
    conversationId: payload.conversationId,
    senderId: payload.senderId,
    content: payload.content,
    createdAt: payload.createdAt,
  }
}

export function toChatMessageState(
  message: ChatMessagesResponse['data']['items'][number],
): ChatMessageState {
  return {
    id: message.id ?? '',
    conversationId: message.conversationId ?? '',
    senderId: message.senderId ?? '',
    content: message.content ?? '',
    createdAt: message.createdAt ?? '',
  }
}
