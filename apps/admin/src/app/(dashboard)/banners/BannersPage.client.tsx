'use client'

import { Banners } from '@ecom/ui-admin'
import { useBannersAdapter } from '@/features/banners/hooks/use-banners-adapter'

export function BannersPageClient() {
  const { loading: _loading, error: _error, ...props } = useBannersAdapter()
  return <Banners {...props} />
}
