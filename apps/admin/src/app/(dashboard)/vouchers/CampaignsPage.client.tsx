'use client'

import { Campaigns } from '@ecom/ui-admin'
import { useCampaignsAdapter } from '@/features/promotions/hooks/use-campaigns-adapter'
import { stripAdapterMeta } from '@/lib/adapter-utils'

export function CampaignsPageClient() {
  return <Campaigns {...stripAdapterMeta(useCampaignsAdapter())} />
}
