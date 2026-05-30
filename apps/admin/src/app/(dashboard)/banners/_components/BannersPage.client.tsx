'use client'

import { Banners } from '@ecom/ui-admin/pages/Banners'
import { useBannersAdapter } from '@/features/banners/hooks/use-banners-adapter'

export function BannersPageClient() {
  const props = useBannersAdapter()
  return <Banners {...props} />
}
