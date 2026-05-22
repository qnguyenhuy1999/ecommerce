export type ReturnsRefundsStatus = 'OPEN' | 'APPROVED' | 'REFUNDED' | 'REJECTED'

export type ReturnsRefundsStatusTab = 'ALL' | ReturnsRefundsStatus
export type ReturnsRefundsAction = 'approve' | 'partial' | 'reject'

export type RefundMethod = 'ORIGINAL_PAYMENT' | 'STORE_CREDIT' | 'BANK_TRANSFER'

export type ReturnsRefundsStatusCounts = Record<ReturnsRefundsStatusTab, number>

export interface ReturnRow {
  id: string
  caseId: string
  orderNumber: string
  buyerName: string
  reason: string
  amount: number
  status: ReturnsRefundsStatus
  openedAtLabel: string
  evidence?: string[]
  href?: string
}

export interface ReturnsRefundsActionPayload {
  action: ReturnsRefundsAction
  id: string
  refundMethod?: RefundMethod
}

export interface ReturnsRefundsProps {
  title?: string
  description?: string
  returns?: ReturnRow[]
  statusTabs?: ReturnsRefundsStatusTab[]
  status?: ReturnsRefundsStatusTab
  defaultStatus?: ReturnsRefundsStatusTab
  onStatusChange?: (status: ReturnsRefundsStatusTab) => void
  statusCounts?: ReturnsRefundsStatusCounts
  searchPlaceholder?: string
  emptyMessage?: string
  filterReturns?: (params: ReturnsRefundsFilterParams) => ReturnRow[]
  onAction?: (payload: ReturnsRefundsActionPayload) => void | Promise<void>
  onApprove?: (id: string, method: RefundMethod) => void
  onPartial?: (id: string, method: RefundMethod) => void
  onReject?: (id: string) => void
}

export interface ReturnsRefundsFilterParams {
  returns: ReturnRow[]
  search: string
  status: ReturnsRefundsStatusTab
}
