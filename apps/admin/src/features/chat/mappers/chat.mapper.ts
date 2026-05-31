import { formatDateTime } from '@ecom/shared/utils/format'
import type { ChatConversation, ChatMessage } from '@ecom/ui-admin/pages/Messages'
import type { ChatMessageDto, ChatSummaryDto } from '../api/chat.api'

function toShortId(value: string): string {
  return `${value.slice(0, 8)}…`
}

function normalizeLastMessageText(value: ChatSummaryDto['lastMessageText']): string | null {
  return typeof value === 'string' ? value : null
}

export function mapChatToRecord(chat: ChatSummaryDto): ChatConversation {
  const lastMessagePreview = normalizeLastMessageText(chat.lastMessageText)

  return {
    id: chat.id,
    buyerName: `Buyer ${toShortId(chat.buyerId)}`,
    buyerInitials: 'B',
    shopIdLabel: `Shop ${toShortId(chat.shopId)}`,
    ...(lastMessagePreview !== null ? { lastMessagePreview } : {}),
    lastMessageAtLabel: formatDateTime(chat.updatedAt),
    lastActivityAt: chat.updatedAt,
  }
}

export function mapChatMessageToRecord(
  message: ChatMessageDto,
  selectedConversation?: ChatSummaryDto,
): ChatMessage {
  const isBuyerMessage = message.senderId === selectedConversation?.buyerId

  return {
    id: message.id,
    content: message.content,
    sender: isBuyerMessage ? 'BUYER' : 'SELLER',
    sentAtLabel: formatDateTime(message.createdAt),
  }
}
