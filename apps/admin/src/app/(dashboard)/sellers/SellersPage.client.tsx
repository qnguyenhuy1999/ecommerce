'use client'

import { SellersKyc } from '@ecom/ui-admin'
import { useSellersKycAdapter } from '@/features/sellers/hooks/use-sellers-kyc-adapter'
import { stripAdapterMeta } from '@/lib/adapter-utils'

export function SellersPageClient() {
  return <SellersKyc {...stripAdapterMeta(useSellersKycAdapter())} />
}
