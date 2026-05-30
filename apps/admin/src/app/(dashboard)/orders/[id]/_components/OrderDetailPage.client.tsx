'use client'

import { OrderDetail } from '@ecom/ui-admin/pages/OrderDetail'
import { useOrderDetailAdapter } from '@/features/orders/hooks/use-order-detail-adapter'
import { stripAdapterMeta } from '@ecom/shared/utils/adapter-utils'

export function OrderDetailPageClient({ id }: { id: string }) {
  return <OrderDetail {...stripAdapterMeta(useOrderDetailAdapter(id))} backHref="/orders" />
}
