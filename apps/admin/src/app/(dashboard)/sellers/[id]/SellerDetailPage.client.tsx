'use client'

import { SellerKycDetail } from '@ecom/ui-admin'
import { useSellerKycDetailAdapter } from '@/features/sellers/hooks/use-seller-kyc-detail-adapter'
import { stripAdapterMeta } from '@/lib/adapter-utils'

export function SellerDetailPageClient({ id }: { id: string }) {
  return <SellerKycDetail {...stripAdapterMeta(useSellerKycDetailAdapter(id))} />
}
