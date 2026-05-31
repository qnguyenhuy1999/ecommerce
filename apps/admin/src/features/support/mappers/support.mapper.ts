import { formatDateIntl, formatDateTime } from '@ecom/shared/utils/format'
import type { MessageConversation, MessageEntry } from '@ecom/ui-admin/pages/Messages'
import type { SupportMessageApiItem, SupportTicketApiItem } from '../api/support.api'

export function mapApiTicketToSupportConversation(item: SupportTicketApiItem): MessageConversation {
  const role = item.submitterRole.toUpperCase()
  const submitterRole = role === 'SELLER' ? 'Seller' : 'Buyer'

  const dateLabel = formatDateIntl(item.createdAt, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return {
    id: item.id,
    buyerName: item.submitterName,
    buyerInitials: item.submitterName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join(''),
    orderLabel: `${submitterRole} support`,
    productLabel: item.status,
    lastMessagePreview: item.title,
    lastMessageAtLabel: dateLabel,
    lastActivityAt: item.updatedAt,
  }
}

export function mapApiMessageToSupportEntry(item: SupportMessageApiItem): MessageEntry {
  const sender = item.sender.toUpperCase() === 'AGENT' ? 'SELLER' : 'BUYER'
  const dateLabel = formatDateTime(item.createdAt, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return {
    id: item.id,
    sender,
    content: item.content,
    sentAtLabel: `${item.senderName} · ${dateLabel}`,
  }
}
