import type { VoucherStatus } from './Campaigns.types'

export const VOUCHER_STATUS_DOT_CLASS: Record<VoucherStatus, string> = {
  DRAFT: 'bg-muted-foreground',
  ACTIVE: 'bg-success',
  PAUSED: 'bg-info',
  EXPIRED: 'bg-muted-foreground',
}

export const VOUCHER_STATUS_LABEL_CLASS: Record<VoucherStatus, string> = {
  DRAFT: 'text-muted-foreground',
  ACTIVE: 'text-success',
  PAUSED: 'text-info',
  EXPIRED: 'text-muted-foreground',
}

export const VOUCHER_STATUS_TEXT: Record<VoucherStatus, string> = {
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  PAUSED: 'Paused',
  EXPIRED: 'Expired',
}

export const VOUCHERS_EMPTY_MESSAGE = 'No vouchers in this tab.'
