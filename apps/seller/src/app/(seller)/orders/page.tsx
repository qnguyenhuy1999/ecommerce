import { headers } from 'next/headers'
import { getOrdersList } from '@/features/orders/api'
import { OrdersPageClient } from './_components/OrdersPage.client'

export default async function OrdersPage() {
  const cookie = (await headers()).get('cookie')
  const init = { cache: 'no-store' as const, ...(cookie ? { headers: { cookie } } : {}) }
  const initialData = await getOrdersList({}, init)
  return <OrdersPageClient initialData={initialData} />
}
