import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { fetchProductById } from '@/lib/api-server'

import { ProductDetailView, ProductDetailViewSkeleton } from './product-detail-view'

/**
 * Product detail (Server Component). Fetches the product on the server with
 * Next data caching keyed by product id, then hands the rendered shell off to
 * a small client island responsible for cart-add interactivity.
 */
export const revalidate = 60

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params
  return (
    <Suspense fallback={<ProductDetailViewSkeleton />}>
      <ProductDetailLoader id={id} />
    </Suspense>
  )
}

async function ProductDetailLoader({ id }: { id: string }) {
  const product = await fetchProductById(id)
  if (!product) notFound()
  return <ProductDetailView product={product} />
}
