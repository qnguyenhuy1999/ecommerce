'use client'

import type { DisputesProps } from '@ecom/ui-admin'
import { useRouter } from 'next/navigation'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { useRefunds } from '../hooks/use-refunds'
import { mapRefundToDisputeRecord } from '../mappers/dispute.mapper'

export function useDisputesAdapter(): DisputesProps & {
  loading: boolean
  error: Error | null
} {
  const router = useRouter()
  const refundsQuery = useRefunds({ page: 1, limit: PAGINATION_DEFAULTS.PAGE_SIZE })

  const items = (refundsQuery.data?.items ?? []).map(mapRefundToDisputeRecord)

  return {
    loading: refundsQuery.isPending,
    error: refundsQuery.error,
    items,
    onOpenCase: (item) => {
      router.push(`/refunds/${item.id}`)
    },
  }
}
