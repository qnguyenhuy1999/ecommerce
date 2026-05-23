'use client'

import { CommissionFees } from '@ecom/ui-admin'
import { useCommissionFeesAdapter } from '@/features/commission-fees/hooks/use-commission-fees-adapter'

export function CommissionFeesPageClient() {
  const { commissionFeesProps } = useCommissionFeesAdapter()
  return <CommissionFees {...commissionFeesProps} />
}
