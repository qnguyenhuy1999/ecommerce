import { formatCurrency } from '@ecom/shared/utils/format'
import type {
  RefundMethod,
  ReturnRow,
  ReturnsRefundsAction,
  ReturnsRefundsActionPayload,
  ReturnsRefundsStatus,
  ReturnsRefundsStatusCounts,
  ReturnsRefundsStatusTab,
} from './ReturnsRefunds.types'

export const RETURN_STATUS_TABS = [
  'ALL',
  'OPEN',
  'APPROVED',
  'REFUNDED',
  'REJECTED',
] as const satisfies readonly ReturnsRefundsStatusTab[]

export function formatReturnAmount(amount: number) {
  return formatCurrency(amount)
}

export const returnStatusClassNames = {
  OPEN: {
    text: 'text-info',
    dot: 'bg-info',
  },
  APPROVED: {
    text: 'text-success',
    dot: 'bg-success',
  },
  REFUNDED: {
    text: 'text-warning',
    dot: 'bg-warning',
  },
  REJECTED: {
    text: 'text-destructive',
    dot: 'bg-destructive',
  },
} as const satisfies Record<ReturnsRefundsStatus, { text: string; dot: string }>

export const returnStatusLabels = {
  ALL: 'All',
  OPEN: 'Open',
  APPROVED: 'Approved',
  REFUNDED: 'Refunded',
  REJECTED: 'Rejected',
} as const satisfies Record<ReturnsRefundsStatusTab, string>

export const refundMethodLabels = {
  ORIGINAL_PAYMENT: 'Refund to original payment',
  STORE_CREDIT: 'Refund as store credit',
  BANK_TRANSFER: 'Refund via bank transfer',
} as const satisfies Record<RefundMethod, string>

export function buildReturnStatusCounts(returns: ReturnRow[]): ReturnsRefundsStatusCounts {
  const counts: ReturnsRefundsStatusCounts = {
    ALL: 0,
    OPEN: 0,
    APPROVED: 0,
    REFUNDED: 0,
    REJECTED: 0,
  }

  for (const item of returns) {
    counts.ALL += 1
    counts[item.status] += 1
  }

  return counts
}

export function buildReturnActionPayload(
  action: ReturnsRefundsAction,
  row: ReturnRow,
  refundMethod: RefundMethod,
): ReturnsRefundsActionPayload {
  return action === 'reject'
    ? {
        action,
        id: row.id,
      }
    : {
        action,
        id: row.id,
        refundMethod,
      }
}
