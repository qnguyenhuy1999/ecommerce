export const refundStatuses = [
  'REQUESTED',
  'REVIEWING',
  'APPROVED',
  'REJECTED',
  'REFUNDED',
  'CLOSED',
] as const

export type RefundStatus = (typeof refundStatuses)[number]

export type RefundCasePriority = 'HIGH' | 'MEDIUM' | 'LOW'

export type RefundCaseQueue = 'OPS' | 'RISK' | 'SUPPORT'

export type RefundCaseResolution = 'UNRESOLVED' | 'BUYER_REFUND' | 'SELLER_CLOSED'

export interface RefundCaseFilterOption<TValue extends string = string> {
  value: TValue
  label: string
}

export interface RefundRecord {
  id: string
  orderId: string
  buyerName: string
  sellerName: string
  amountLabel: string
  reason: string
  openedAtLabel: string
  status: RefundStatus
  priority: RefundCasePriority
  queue: RefundCaseQueue
  resolution: RefundCaseResolution
  note: string
  ownerLabel: string
  timelineLabel: string
}

export interface RefundsProps {
  title?: string
  description?: string
  searchPlaceholder?: string
  openLabel?: string
  summaryLabel?: string
  filtersLabel?: string
  emptyStateMessage?: string
  priorityOptions?: RefundCaseFilterOption<'ALL' | RefundCasePriority>[]
  statusOptions?: RefundCaseFilterOption<'ALL' | RefundStatus>[]
  queueOptions?: RefundCaseFilterOption<'ALL' | RefundCaseQueue>[]
  resolutionOptions?: RefundCaseFilterOption<'ALL' | RefundCaseResolution>[]
  items?: RefundRecord[]
  onOpenCase?: ((item: RefundRecord) => void | Promise<void>) | undefined
}
