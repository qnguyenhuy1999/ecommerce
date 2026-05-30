'use client'

import { Refunds } from '@ecom/ui-admin'
import { useRefundsAdapter } from '@/features/refunds/hooks/use-disputes-adapter'
import { stripAdapterMeta } from '@ecom/shared'

export function RefundsPageClient() {
  return <Refunds {...stripAdapterMeta(useRefundsAdapter())} />
}
