import type { DisputeRecord, DisputeStatus } from '@ecom/ui-admin'
import type { RefundListItem } from '../api/refunds.api'

function toDisputeStatus(status: string): DisputeStatus {
  const map: Record<string, DisputeStatus> = {
    PENDING: 'OPEN',
    REVIEWING: 'UNDER_REVIEW',
    ESCALATED: 'ESCALATED',
    APPROVED: 'REFUNDED_BUYER',
    REJECTED: 'CLOSED_SELLER',
    RESOLVED: 'REFUNDED_BUYER',
    CLOSED: 'CLOSED_SELLER',
  }
  return map[status] ?? 'OPEN'
}

export function mapRefundToDisputeRecord(refund: RefundListItem): DisputeRecord {
  return {
    id: refund.id,
    orderId: refund.id,
    buyerName: '—',
    sellerName: '—',
    amountLabel: refund.refundAmount ? `$${Number(refund.refundAmount).toFixed(2)}` : '—',
    reason: refund.reason,
    openedAtLabel: new Date(refund.createdAt).toLocaleDateString(),
    status: toDisputeStatus(refund.status),
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
  } satisfies DisputeRecord
}
