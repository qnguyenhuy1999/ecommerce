'use client'

import { DisputeDetail } from '@ecom/ui-admin'
import { useDisputeDetailAdapter } from '@/features/refunds/hooks/use-dispute-detail-adapter'
import { stripAdapterMeta } from '@/lib/adapter-utils'

export function DisputeDetailPageClient({ id }: { id: string }) {
  return <DisputeDetail {...stripAdapterMeta(useDisputeDetailAdapter(id))} />
}
