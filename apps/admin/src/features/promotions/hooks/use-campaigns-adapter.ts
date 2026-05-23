'use client'

import type { CampaignsProps } from '@ecom/ui-admin'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { useVouchers } from '../hooks/use-promotions'
import { mapVoucherToCampaignRecord } from '../mappers/campaign.mapper'

export function useCampaignsAdapter(): CampaignsProps & { loading: boolean; error: Error | null } {
  const vouchersQuery = useVouchers({ page: 1, limit: PAGINATION_DEFAULTS.PAGE_SIZE })

  return {
    loading: vouchersQuery.isPending,
    error: vouchersQuery.error,
    items: (vouchersQuery.data?.items ?? []).map(mapVoucherToCampaignRecord),
  }
}
