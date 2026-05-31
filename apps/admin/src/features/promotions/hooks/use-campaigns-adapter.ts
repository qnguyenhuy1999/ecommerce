'use client'

import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core/constants'
import type { CampaignsProps } from '@ecom/ui-admin/pages/'
import { useVouchers } from '../hooks/use-promotions'
import { mapCampaignToCampaignRecord } from '../mappers/campaign.mapper'

export function useVouchersAdapter(): CampaignsProps & { loading: boolean; error: Error | null } {
  const vouchersQuery = useVouchers({ page: 1, limit: PAGINATION_DEFAULTS.PAGE_SIZE })

  return {
    loading: vouchersQuery.isPending,
    error: vouchersQuery.error,
    items: (vouchersQuery.data?.items ?? []).map(mapCampaignToCampaignRecord),
  }
}
