'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

import { productClient } from '@ecom/api-client'
import type { ProductListRequest } from '@ecom/api-types'

import {
  CollectionPageLayout,
  ProductGrid,
  StorefrontFooter,
  StorefrontHeader,
} from '@ecom/ui-storefront'

import { useStorefrontChrome } from '@/components/storefront-chrome'
import { toStorefrontProduct } from '@/lib/product-mapper'

const SORT_TO_API: Record<string, Pick<ProductListRequest, 'sortBy' | 'sortOrder'>> = {
  newest: { sortBy: 'createdAt', sortOrder: 'desc' },
  popular: { sortBy: 'rating', sortOrder: 'desc' },
  price_asc: { sortBy: 'price', sortOrder: 'asc' },
  price_desc: { sortBy: 'price', sortOrder: 'desc' },
  name: { sortBy: 'name', sortOrder: 'asc' },
}

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { promoBar, headerProps, footerProps } = useStorefrontChrome()

  const search = searchParams.get('q') ?? undefined
  const categoryId = searchParams.get('categoryId') ?? undefined
  const sort = searchParams.get('sort') ?? undefined
  const apiSort = sort ? SORT_TO_API[sort] : undefined

  const params: ProductListRequest = {
    page: 1,
    limit: 24,
    ...(search ? { search } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(apiSort ?? {}),
    status: 'ACTIVE',
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', 'list', params],
    queryFn: () => productClient.list(params),
  })

  const products = (data?.data ?? []).map(toStorefrontProduct)
  const totalLabel = isLoading
    ? 'Loading...'
    : `${products.length} ${products.length === 1 ? 'result' : 'results'}`

  const titleText = search ? `Results for "${search}"` : categoryId ? `Browse ${categoryId}` : 'All products'

  return (
    <CollectionPageLayout
      promoBar={promoBar}
      header={<StorefrontHeader {...headerProps} />}
      footer={<StorefrontFooter {...footerProps} />}
      breadcrumb={
        <span>
          <a href="/" className="hover:underline">Home</a> · {titleText}
        </span>
      }
      title={titleText}
      description="Discover items from sellers across the marketplace."
      resultsLabel={totalLabel}
      filters={[]}
      grid={
        <ProductGrid
          products={products}
          loading={isLoading}
          onAddToCart={(id) => router.push(`/products/${id}`)}
          emptyMessage={
            isError
              ? "We couldn't load products right now. Please try again."
              : 'No products match these filters.'
          }
        />
      }
    />
  )
}
