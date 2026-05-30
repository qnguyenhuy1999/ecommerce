'use client'

import { OrderDetail } from '@ecom/ui-admin'
import { useOrderDetailAdapter } from '@/features/orders/hooks/use-order-detail-adapter'
import { stripAdapterMeta } from '@ecom/shared'

export function OrderDetailPageClient({ id }: { id: string }) {
  return <OrderDetail {...stripAdapterMeta(useOrderDetailAdapter(id))} backHref="/orders" />
}
