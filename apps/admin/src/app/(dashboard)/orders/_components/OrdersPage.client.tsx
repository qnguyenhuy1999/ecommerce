'use client'

import { Orders } from '@ecom/ui-admin/pages/Orders'
import { useOrdersAdapter } from '@/features/orders/hooks/use-orders-adapter'
import { stripAdapterMeta } from '@ecom/shared/utils/adapter-utils'

export function OrdersPageClient() {
  return <Orders {...stripAdapterMeta(useOrdersAdapter())} />
}
