import { Typography } from '@ecom/core-ui/atoms/Typography'
import { cn } from '@ecom/shared/utils/cn'
import { VOUCHER_STATUS_LABEL_CLASS, VOUCHER_STATUS_TEXT } from '../Campaigns.constants'
import type { VoucherStatus } from '../Campaigns.types'

export function StatusLabel({ status }: { status: VoucherStatus }) {
  return (
    <Typography variant="caption" className={cn('font-medium', VOUCHER_STATUS_LABEL_CLASS[status])}>
      {VOUCHER_STATUS_TEXT[status]}
    </Typography>
  )
}
