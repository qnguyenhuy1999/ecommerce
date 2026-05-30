'use client'

import { Vouchers } from '@ecom/ui-admin/pages/Campaigns'
import { useVouchersAdapter } from '@/features/promotions/hooks/use-campaigns-adapter'
import { stripAdapterMeta } from '@ecom/shared/utils/adapter-utils'

export function VouchersPageClient() {
  return <Vouchers {...stripAdapterMeta(useVouchersAdapter())} />
}
