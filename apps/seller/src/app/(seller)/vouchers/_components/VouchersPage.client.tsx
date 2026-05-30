'use client'

import { Vouchers } from '@ecom/ui-seller/pages/Vouchers'
import { useVouchersAdapter } from '@/features/vouchers/hooks/use-vouchers-adapter'

type VouchersPageClientProps = { initialData?: Parameters<typeof useVouchersAdapter>[0] }

export function VouchersPageClient({ initialData }: VouchersPageClientProps) {
  const { vouchers } = useVouchersAdapter(initialData)

  return (
    <Vouchers
      newVoucherHref="/vouchers/new"
      vouchers={vouchers}
      emptyMessage="No vouchers available yet."
    />
  )
}
