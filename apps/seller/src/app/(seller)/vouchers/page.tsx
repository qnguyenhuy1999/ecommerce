'use client'

import { Vouchers } from '@ecom/ui-seller/pages/Vouchers'
import { useVouchersAdapter } from '@/features/vouchers/hooks/use-vouchers-adapter'

export default function VouchersPage() {
  const { vouchers } = useVouchersAdapter()

  return (
    <Vouchers
      newVoucherHref="/vouchers/new"
      vouchers={vouchers}
      emptyMessage="No vouchers available yet."
    />
  )
}
