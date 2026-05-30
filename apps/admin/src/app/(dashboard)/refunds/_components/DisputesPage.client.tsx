'use client'

import { Refunds } from '@ecom/ui-admin/pages/Disputes'
import { useRefundsAdapter } from '@/features/refunds/hooks/use-disputes-adapter'
import { stripAdapterMeta } from '@ecom/shared/utils/adapter-utils'

export function RefundsPageClient() {
  return <Refunds {...stripAdapterMeta(useRefundsAdapter())} />
}
