import type { SupportMessage, SupportTicket } from '@ecom/ui-admin'
import type { SupportMessageApiItem, SupportTicketApiItem } from '../api/support.api'

export function mapApiTicketToSupportTicket(item: SupportTicketApiItem): SupportTicket {
  const role = item.submitterRole.toUpperCase()
  const submitterRole: SupportTicket['submitterRole'] = role === 'SELLER' ? 'Seller' : 'Buyer'

  const createdDate = new Date(item.createdAt)
  const dateLabel = createdDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })

  return {
    id: item.id,
    title: item.title,
    submitterName: item.submitterName,
    submitterRole,
    dateLabel,
    status: item.status,
    openedAtLabel: dateLabel,
  }
}

export function mapApiMessageToSupportMessage(item: SupportMessageApiItem): SupportMessage {
  const sender = item.sender.toUpperCase() as SupportMessage['sender']
  const createdDate = new Date(item.createdAt)
  const dateLabel = createdDate.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return {
    id: item.id,
    sender,
    senderName: item.senderName,
    content: item.content,
    dateLabel,
  }
}
