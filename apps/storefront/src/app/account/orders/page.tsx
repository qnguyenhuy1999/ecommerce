import { Suspense } from 'react'

import { fetchOrders } from '@/lib/api-server'

import { OrderHistoryView, OrderHistoryViewSkeleton } from './order-history-view'

/**
 * Order history (Server Component). Forwards cookies to fetch the user's
 * orders on the server, then hands off to a small client island that owns
 * search/tab state.
 */
export const dynamic = 'force-dynamic'

export default function OrderHistoryPage() {
  return (
    <Suspense fallback={<OrderHistoryViewSkeleton />}>
      <OrderHistoryLoader />
    </Suspense>
  )
}

async function OrderHistoryLoader() {
  const envelope = await fetchOrders({ page: 1, limit: 50 })
  return <OrderHistoryView initialOrders={envelope.data} />
}
