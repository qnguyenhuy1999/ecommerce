'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

import {
  CollectionPageLayout,
  ProductGrid,
  StorefrontFooter,
  StorefrontHeader,
} from '@ecom/ui-storefront'

import type { ProductResponse } from '@ecom/api-types'

import { useStorefrontChrome } from '@/components/storefront-chrome'
import { toStorefrontProduct } from '@/lib/product-mapper'

export interface ProductsViewProps {
  title: string
  initialProducts: ProductResponse[]
}

/**
 * Client view for the products collection page. The layout itself is a client
 * component (mobile filter sheet), so we keep this island small and rely on
 * the Server Component above for data fetching + cache lookups.
 */
export function ProductsView({ title, initialProducts }: ProductsViewProps) {
  const router = useRouter()
  const { promoBar, headerProps, footerProps } = useStorefrontChrome()

  const products = React.useMemo(
    () => initialProducts.map(toStorefrontProduct),
    [initialProducts],
  )

  const totalLabel = `${products.length} ${products.length === 1 ? 'result' : 'results'}`

  return (
    <CollectionPageLayout
      promoBar={promoBar}
      header={<StorefrontHeader {...headerProps} />}
      footer={<StorefrontFooter {...footerProps} />}
      breadcrumb={
        <span>
          <a href="/" className="hover:underline">
            Home
          </a>{' '}
          · {title}
        </span>
      }
      title={title}
      description="Discover items from sellers across the marketplace."
      resultsLabel={totalLabel}
      filters={[]}
      grid={
        <ProductGrid
          products={products}
          loading={false}
          onAddToCart={(id) => router.push(`/products/${id}`)}
          emptyMessage="No products match these filters."
        />
      }
    />
  )
}

/** Server-render-friendly skeleton (no client hooks). */
export function ProductsViewSkeleton({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8">
      <div className="mb-6 space-y-2">
        <div className="text-sm text-[var(--text-secondary)]">Home · {title}</div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-muted)]"
          />
        ))}
      </div>
    </div>
  )
}
