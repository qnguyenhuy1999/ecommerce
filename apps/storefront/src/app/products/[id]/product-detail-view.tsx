'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { cartClient } from '@ecom/api-client'
import type { ProductResponse } from '@ecom/api-types'

import {
  ProductDetailLayout,
  ProductGallery,
  ProductGalleryMain,
  ProductGalleryThumbnails,
  StorefrontFooter,
  StorefrontHeader,
} from '@ecom/ui-storefront'

import { useStorefrontChrome } from '@/components/storefront-chrome'

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=1400&fit=crop'

export interface ProductDetailViewProps {
  product: ProductResponse
}

/**
 * Client island for the product detail page. The product itself is fetched on
 * the server (cached via the Next data cache), so this component only ships
 * the JS needed for the gallery + add-to-cart mutation.
 */
export function ProductDetailView({ product }: ProductDetailViewProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { promoBar, headerProps, footerProps } = useStorefrontChrome()

  const galleryImages = React.useMemo(
    () =>
      (product.images.length > 0 ? product.images : [PLACEHOLDER_IMAGE]).map((src, i) => ({
        id: `${product.id}-${i}`,
        src,
        alt: `${product.name} image ${i + 1}`,
      })),
    [product.id, product.images, product.name],
  )

  const totalStock = React.useMemo(
    () =>
      (product.variants ?? []).reduce((acc, v) => acc + Math.max(0, v.stock - v.reservedStock), 0),
    [product.variants],
  )

  const stockStatus = totalStock === 0 ? 'out-of-stock' : totalStock < 10 ? 'low-stock' : 'in-stock'

  const primaryVariantId = product.variants?.[0]?.id

  const addToCart = useMutation({
    mutationFn: (variantId: string) => cartClient.addItem(variantId, 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      router.push('/cart')
    },
  })

  return (
    <ProductDetailLayout
      promoBar={promoBar}
      header={<StorefrontHeader {...headerProps} />}
      footer={<StorefrontFooter {...footerProps} />}
      breadcrumb={
        <span>
          <a href="/" className="hover:underline">
            Home
          </a>{' '}
          ·{' '}
          <a href="/products" className="hover:underline">
            Products
          </a>{' '}
          · {product.name}
        </span>
      }
      title={product.name}
      brand={product.sellerId}
      price={product.price}
      rating={product.rating || undefined}
      reviewCount={product.reviewCount || undefined}
      status={stockStatus}
      statusCount={totalStock}
      gallery={
        <ProductGallery images={galleryImages}>
          <ProductGalleryThumbnails />
          <ProductGalleryMain />
        </ProductGallery>
      }
      description={
        product.description ? (
          <div className="prose prose-sm max-w-none whitespace-pre-line text-[var(--text-secondary)]">
            {product.description}
          </div>
        ) : (
          <p className="text-[var(--text-secondary)]">
            This seller has not added a description yet.
          </p>
        )
      }
      onAddToCart={() => {
        if (!primaryVariantId) {
          router.push('/cart')
          return
        }
        addToCart.mutate(primaryVariantId)
      }}
    />
  )
}

/** Server-render-friendly skeleton — no client hooks required. */
export function ProductDetailViewSkeleton() {
  return (
    <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-2">
      <div className="aspect-square w-full animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-muted)]" />
      <div className="space-y-4">
        <div className="h-6 w-3/4 animate-pulse rounded bg-[var(--surface-muted)]" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--surface-muted)]" />
        <div className="h-10 w-1/3 animate-pulse rounded bg-[var(--surface-muted)]" />
        <div className="h-32 w-full animate-pulse rounded bg-[var(--surface-muted)]" />
      </div>
    </div>
  )
}
