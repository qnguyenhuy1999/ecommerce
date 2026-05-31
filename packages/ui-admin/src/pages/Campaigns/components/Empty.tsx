import { Button, Typography } from '@ecom/core-ui'
import { Plus, Ticket } from 'lucide-react'
import type { VouchersProps } from '../..'
import { VOUCHERS_EMPTY_MESSAGE } from '../Campaigns.constants'

interface EmptyProps {
  newVoucherLabel: string
  onNewVoucher?: VouchersProps['onNewVoucher'] | undefined
}

export function Empty({ newVoucherLabel, onNewVoucher }: EmptyProps) {
  return (
    <div className="border-border bg-muted/20 flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center">
      <div className="bg-primary-soft text-primary mb-4 flex size-12 items-center justify-center rounded-2xl">
        <Ticket className="size-6" />
      </div>

      <Typography variant="body-sm" className="font-semibold">
        {VOUCHERS_EMPTY_MESSAGE}
      </Typography>

      <Typography variant="caption" className="text-muted-foreground mt-2 max-w-sm">
        Create a voucher campaign to start increasing customer engagement and redemptions.
      </Typography>

      <Button type="button" className="mt-5" onClick={() => void onNewVoucher?.()}>
        <Plus className="size-4" />
        {newVoucherLabel}
      </Button>
    </div>
  )
}
