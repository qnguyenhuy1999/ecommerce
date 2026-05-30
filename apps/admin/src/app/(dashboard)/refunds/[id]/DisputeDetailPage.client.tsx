'use client'

import { RefundDetail } from '@ecom/ui-admin'
import { useRefundDetailAdapter } from '@/features/refunds/hooks/use-dispute-detail-adapter'
import { stripAdapterMeta } from '@ecom/shared'

export function RefundDetailPageClient({ id }: { id: string }) {
  return <RefundDetail {...stripAdapterMeta(useRefundDetailAdapter(id))} />
}
