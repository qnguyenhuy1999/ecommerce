import { headers } from 'next/headers'
import { getOrderDetail } from '@/features/orders/api'
import { mapOrderDetail } from '@/features/orders/mappers'
import { OrderDetailPageClient } from './_components/OrderDetailPage.client'

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params
  const cookie = (await headers()).get('cookie')
  const init = { cache: 'no-store' as const, ...(cookie ? { headers: { cookie } } : {}) }
  const order = await getOrderDetail(id, init)
  const initialData = order ? mapOrderDetail(order) : null
  return <OrderDetailPageClient orderId={id} initialData={initialData} />
}
