export const disputeStatuses = [
  'OPEN',
  'UNDER_REVIEW',
  'ESCALATED',
  'REFUNDED_BUYER',
  'CLOSED_SELLER',
] as const

export type DisputeStatus = (typeof disputeStatuses)[number]

export type DisputePriority = 'HIGH' | 'MEDIUM' | 'LOW'

export type DisputeQueue = 'OPS' | 'RISK' | 'SUPPORT'

export type DisputeResolution = 'UNRESOLVED' | 'BUYER_REFUND' | 'SELLER_CLOSED'

export interface DisputeFilterOption<TValue extends string = string> {
  value: TValue
  label: string
}

export interface DisputeRecord {
  id: string
  orderId: string
  buyerName: string
  sellerName: string
  amountLabel: string
  reason: string
  openedAtLabel: string
  status: DisputeStatus
  priority: DisputePriority
  queue: DisputeQueue
  resolution: DisputeResolution
  note: string
  ownerLabel: string
  timelineLabel: string
}

export interface DisputesProps {
  title?: string
  description?: string
  searchPlaceholder?: string
  openLabel?: string
  summaryLabel?: string
  filtersLabel?: string
  emptyStateMessage?: string
  priorityOptions?: DisputeFilterOption<'ALL' | DisputePriority>[]
  statusOptions?: DisputeFilterOption<'ALL' | DisputeStatus>[]
  queueOptions?: DisputeFilterOption<'ALL' | DisputeQueue>[]
  resolutionOptions?: DisputeFilterOption<'ALL' | DisputeResolution>[]
  items?: DisputeRecord[]
  onOpenCase?: ((item: DisputeRecord) => void | Promise<void>) | undefined
}
