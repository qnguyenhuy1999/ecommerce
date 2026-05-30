import { formatDateIntl } from '@ecom/shared/utils/format'
import type { RefundRecord, RefundStatus } from '@ecom/ui-admin/pages/Disputes'
import type { RefundListItem } from '../api/refunds.api'

function toRefundStatus(status: string): RefundStatus {
  const map: Record<string, RefundStatus> = {
    REQUESTED: 'REQUESTED',
    REVIEWING: 'REVIEWING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    RETURN_SHIPPING: 'REQUESTED',
    RECEIVED: 'REVIEWING',
    REFUNDED: 'REFUNDED',
    CLOSED: 'CLOSED',
  }
  return map[status] ?? 'REQUESTED'
}

export function mapRefundToRefundRecord(refund: RefundListItem): RefundRecord {
  return {
    id: refund.id,
    orderId: refund.id,
    buyerName: '—',
    sellerName: '—',
    amountLabel: refund.refundAmount ? `$${Number(refund.refundAmount).toFixed(2)}` : '—',
    reason: refund.reason,
    openedAtLabel: formatDateIntl(refund.createdAt),
    status: toRefundStatus(refund.status),
    priority: 'MEDIUM',
    queue: 'SUPPORT',
    resolution:
      refund.status === 'APPROVED'
        ? 'BUYER_REFUND'
        : refund.status === 'REJECTED'
          ? 'SELLER_CLOSED'
          : 'UNRESOLVED',
    note: '',
    ownerLabel: '—',
    timelineLabel: refund.timeline?.length ? `${refund.timeline.length} events` : '—',
  } satisfies RefundRecord
}
