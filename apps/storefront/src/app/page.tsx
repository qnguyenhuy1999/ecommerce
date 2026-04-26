import { Suspense } from 'react'

import { fetchProducts } from '@/lib/api-server'

import { HomeView, HomeViewSkeleton } from './home-view'

/**
 * Storefront home page (Server Component).
 *
 * - `revalidate = 60` so popular product reads are served from the Next data
 *   cache and the origin only sees roughly one request per minute.
 * - The home shell (chrome + hero + categories) renders immediately; product
 *   data streams in via {@link HomeProducts} wrapped in `<Suspense>` so a slow
 *   API never blocks first paint.
 */
export const revalidate = 60

export default function HomePage() {
  return (
    <Suspense fallback={<HomeViewSkeleton />}>
      <HomeProducts />
    </Suspense>
  )
}

async function HomeProducts() {
  const envelope = await fetchProducts({ page: 1, limit: 12 })
  return <HomeView initialProducts={envelope.data} />
}
