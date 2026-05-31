import { cn } from '@ecom/shared/utils/cn'
import { VOUCHER_STATUS_DOT_CLASS } from '../Campaigns.constants'
import type { VoucherStatus } from '../Campaigns.types'

export function StatusDot({ status }: { status: VoucherStatus }) {
  return (
    <span className={cn('inline-block size-2 rounded-full', VOUCHER_STATUS_DOT_CLASS[status])} />
  )
}
