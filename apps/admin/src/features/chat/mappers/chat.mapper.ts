import { formatDateTime } from '@ecom/shared'
import type { ChatConversationRecord, ChatMessageRecord } from '@ecom/ui-admin'
import type { ChatMessageDto, ChatSummaryDto } from '../api/chat.api'

function toShortId(value: string): string {
  return `${value.slice(0, 8)}…`
}

function normalizeLastMessageText(value: ChatSummaryDto['lastMessageText']): string | null {
  return typeof value === 'string' ? value : null
}

export function mapChatToRecord(chat: ChatSummaryDto): ChatConversationRecord {
  return {
    id: chat.id,
    buyerIdShort: toShortId(chat.buyerId),
    shopIdShort: toShortId(chat.shopId),
    lastMessageText: normalizeLastMessageText(chat.lastMessageText),
  }
}

export function mapChatMessageToRecord(message: ChatMessageDto): ChatMessageRecord {
  return {
    id: message.id,
    content: message.content,
    senderIdShort: toShortId(message.senderId),
    createdAtLabel: formatDateTime(message.createdAt),
  }
}
