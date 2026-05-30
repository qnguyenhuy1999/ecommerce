'use client'

import type { BannersProps } from '@ecom/ui-admin/pages/Banners'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { useBanners } from '../hooks/use-banners'
import { mapBannerToRecord } from '../mappers/banner.mapper'

export function useBannersAdapter(): BannersProps & { loading: boolean; error: Error | null } {
  const query = useBanners({ page: 1, limit: PAGINATION_DEFAULTS.PAGE_SIZE })

  return {
    loading: query.isPending,
    error: query.error,
    items: (query.data?.items ?? []).map(mapBannerToRecord),
  }
}
