'use client'

import { Vouchers } from '@ecom/ui-admin'
import { useVouchersAdapter } from '@/features/promotions/hooks/use-campaigns-adapter'
import { stripAdapterMeta } from '@/lib/adapter-utils'

export function VouchersPageClient() {
  return <Vouchers {...stripAdapterMeta(useVouchersAdapter())} />
}
