'use client'

import { Vouchers } from '@ecom/ui-seller'
import { useVouchersAdapter } from '@/features/vouchers/hooks/use-vouchers-adapter'

export default function VouchersPage() {
  const { loading, vouchers } = useVouchersAdapter()

  return (
    <Vouchers
      newVoucherHref="/vouchers/new"
      vouchers={vouchers}
      emptyMessage="No vouchers available yet."
    />
  )
}
