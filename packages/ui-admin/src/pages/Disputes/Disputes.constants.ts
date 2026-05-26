import type { RefundCasePriority } from './Disputes.types'

export const REFUNDS_PRIORITY_DOT_CLASS_NAMES: Record<RefundCasePriority, string> = {
  HIGH: 'fill-destructive text-destructive',
  MEDIUM: 'fill-warning text-warning',
  LOW: 'fill-muted-foreground text-muted-foreground',
} as const

export function getDisputePriorityDotClassName(priority: RefundCasePriority): string {
  return REFUNDS_PRIORITY_DOT_CLASS_NAMES[priority] ?? 'fill-muted-foreground text-muted-foreground'
}

export const REFUNDS_DEFAULT_FILTER = 'ALL' as const

export type RefundsFilterAllOption = typeof REFUNDS_DEFAULT_FILTER

export function filterRefundItems<
  TItem extends {
    id: string
    orderId: string
    buyerName: string
    sellerName: string
    reason: string
    priority: string
    status: string
    queue: string
    resolution: string
  },
>(
  items: TItem[],
  {
    search,
    priorityFilter,
    statusFilter,
    queueFilter,
    resolutionFilter,
  }: {
    search: string
    priorityFilter: string
    statusFilter: string
    queueFilter: string
    resolutionFilter: string
  },
): TItem[] {
  const query = search.trim().toLowerCase()

  return items.filter((item) => {
    const matchesSearch =
      query.length === 0 ||
      item.id.toLowerCase().includes(query) ||
      item.orderId.toLowerCase().includes(query) ||
      item.buyerName.toLowerCase().includes(query) ||
      item.sellerName.toLowerCase().includes(query) ||
      item.reason.toLowerCase().includes(query)

    const matchesPriority =
      priorityFilter === REFUNDS_DEFAULT_FILTER || item.priority === priorityFilter
    const matchesStatus = statusFilter === REFUNDS_DEFAULT_FILTER || item.status === statusFilter
    const matchesQueue = queueFilter === REFUNDS_DEFAULT_FILTER || item.queue === queueFilter
    const matchesResolution =
      resolutionFilter === REFUNDS_DEFAULT_FILTER || item.resolution === resolutionFilter

    return matchesSearch && matchesPriority && matchesStatus && matchesQueue && matchesResolution
  })
}
