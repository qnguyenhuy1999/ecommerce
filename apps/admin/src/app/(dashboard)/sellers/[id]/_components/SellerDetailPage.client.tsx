'use client'

import { SellerKycDetail } from '@ecom/ui-admin/pages/SellerKycDetail'
import { useSellerKycDetailAdapter } from '@/features/sellers/hooks/use-seller-kyc-detail-adapter'
import { stripAdapterMeta } from '@ecom/shared/utils/adapter-utils'

export function SellerDetailPageClient({ id }: { id: string }) {
  return <SellerKycDetail {...stripAdapterMeta(useSellerKycDetailAdapter(id))} />
}
