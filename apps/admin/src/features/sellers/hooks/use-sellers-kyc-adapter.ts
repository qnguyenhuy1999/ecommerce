'use client'

import type { SellerKycProps } from '@ecom/ui-admin'
import { useRouter } from 'next/navigation'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { useSellers, useSellerStatusCounts } from '../hooks/use-sellers'
import { mapSellerToKycRow, buildSellerKycStatusTabs } from '../mappers/seller-kyc.mapper'

export function useSellersKycAdapter(): SellerKycProps & {
  loading: boolean
  error: Error | null
} {
  const router = useRouter()
  const sellersQuery = useSellers({ page: 1, limit: PAGINATION_DEFAULTS.PAGE_SIZE })
  const countsQuery = useSellerStatusCounts()

  const items = (sellersQuery.data?.items ?? []).map(mapSellerToKycRow)
  const statusTabs = buildSellerKycStatusTabs(countsQuery.data ?? {})

  return {
    loading: sellersQuery.isPending,
    error: sellersQuery.error,
    items,
    statusTabs,
    onReview: (item) => {
      router.push(`/sellers/${item.id}`)
    },
  }
}
