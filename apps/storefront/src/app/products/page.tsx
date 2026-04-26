import { Suspense } from 'react'

import type { ProductListRequest } from '@ecom/api-types'

import { fetchProducts } from '@/lib/api-server'

import { ProductsView, ProductsViewSkeleton } from './products-view'

/**
 * Collection page (Server Component). Reads search/category/sort from the URL
 * once on the server, fetches the matching slice, and streams the results
 * grid in via Suspense so the chrome and toolbar paint immediately.
 */
export const revalidate = 60

const SORT_TO_API: Record<string, Pick<ProductListRequest, 'sort' | 'order'>> = {
  newest: { sort: 'createdAt', order: 'desc' },
  popular: { sort: 'rating', order: 'desc' },
  price_asc: { sort: 'price', order: 'asc' },
  price_desc: { sort: 'price', order: 'desc' },
  name: { sort: 'name', order: 'asc' },
}

interface ProductsPageProps {
  searchParams?: Promise<{ q?: string; categoryId?: string; sort?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const sp = (await searchParams) ?? {}
  const search = sp.q
  const categoryId = sp.categoryId
  const sort = sp.sort
  const apiSort = sort ? SORT_TO_API[sort] : undefined

  const params: ProductListRequest = {
    page: 1,
    limit: 24,
    ...(search ? { q: search } : {}),
    ...(categoryId ? { category: categoryId } : {}),
    ...(apiSort ?? {}),
  }

  const titleText = search
    ? `Results for "${search}"`
    : categoryId
      ? `Browse ${categoryId}`
      : 'All products'

  return (
    <Suspense
      key={`${search ?? ''}-${categoryId ?? ''}-${sort ?? ''}`}
      fallback={<ProductsViewSkeleton title={titleText} />}
    >
      <ProductsResults params={params} title={titleText} />
    </Suspense>
  )
}

async function ProductsResults({
  params,
  title,
}: {
  params: ProductListRequest
  title: string
}) {
  const envelope = await fetchProducts(params)
  return <ProductsView title={title} initialProducts={envelope.data} />
}
