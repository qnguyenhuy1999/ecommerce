import { Suspense } from 'react'

import { fetchCart } from '@/lib/api-server'

import { CartView, CartViewSkeleton } from './cart-view'

/**
 * Cart page (Server Component). Forwards the user's cookies to the API on
 * the server so the initial HTML already contains the cart contents — no
 * client-side waterfall to read the cart, no flash of "loading...".
 *
 * Marked dynamic because the cart is per-user; `cache: 'no-store'` inside
 * the fetcher prevents Next from caching the personalised payload.
 */
export const dynamic = 'force-dynamic'

export default function CartPage() {
  return (
    <Suspense fallback={<CartViewSkeleton />}>
      <CartLoader />
    </Suspense>
  )
}

async function CartLoader() {
  const envelope = await fetchCart()
  return <CartView initialCart={envelope.data} />
}
