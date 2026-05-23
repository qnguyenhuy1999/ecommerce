'use client'

import { Disputes } from '@ecom/ui-admin'
import { useDisputesAdapter } from '@/features/refunds/hooks/use-disputes-adapter'
import { stripAdapterMeta } from '@/lib/adapter-utils'

export function DisputesPageClient() {
  return <Disputes {...stripAdapterMeta(useDisputesAdapter())} />
}
