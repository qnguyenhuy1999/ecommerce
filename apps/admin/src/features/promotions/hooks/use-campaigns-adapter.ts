'use client'

import type { VouchersProps } from '@ecom/ui-admin'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { useVouchers } from '../hooks/use-promotions'
import { mapVoucherToVoucherRecord } from '../mappers/campaign.mapper'

export function useVouchersAdapter(): VouchersProps & { loading: boolean; error: Error | null } {
  const vouchersQuery = useVouchers({ page: 1, limit: PAGINATION_DEFAULTS.PAGE_SIZE })

  return {
    loading: vouchersQuery.isPending,
    error: vouchersQuery.error,
    items: (vouchersQuery.data?.items ?? []).map(mapVoucherToVoucherRecord),
  }
}
