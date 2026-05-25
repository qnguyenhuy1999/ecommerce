'use client'

import { Refunds } from '@ecom/ui-admin'
import { useRefundsAdapter } from '@/features/refunds/hooks/use-disputes-adapter'
import { stripAdapterMeta } from '@/lib/adapter-utils'

export function RefundsPageClient() {
  return <Refunds {...stripAdapterMeta(useRefundsAdapter())} />
}
