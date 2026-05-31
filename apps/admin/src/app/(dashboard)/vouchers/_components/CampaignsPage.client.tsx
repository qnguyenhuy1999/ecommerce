'use client'

import { useVouchersAdapter } from '@/features/promotions/hooks/use-campaigns-adapter'
import { stripAdapterMeta } from '@ecom/shared/utils/adapter-utils'
import { Campaigns } from '@ecom/ui-admin/pages/Campaigns'

export function VouchersPageClient() {
  return <Campaigns {...stripAdapterMeta(useVouchersAdapter())} />
}
