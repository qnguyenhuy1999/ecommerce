import { formatDateTime } from '@ecom/shared/utils/format'
import type {
  MessagesConversationRecord,
  MessagesMessageRecord,
} from '@ecom/ui-storefront/pages/Messages'
import type { ChatConversation, ChatMessagesResponse } from '../../lib/storefront-contracts'
import type { RealtimeChatMessagePayload } from '../../lib/realtime'
import type { ChatMessageState } from './types'

export function mapConversation(conversation: ChatConversation): MessagesConversationRecord {
  return {
    id: conversation.id,
    shopIdShort: conversation.shopId.slice(0, 8),
    lastMessageText: conversation.lastMessageText,
    unreadCount: conversation.buyerUnread,
  }
}

export function mapMessage(message: ChatMessageState): MessagesMessageRecord {
  return {
    id: message.id,
    content: message.content,
    createdAtLabel: formatDateTime(message.createdAt),
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
