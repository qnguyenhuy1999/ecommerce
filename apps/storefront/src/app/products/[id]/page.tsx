'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { cartClient, productClient } from '@ecom/api-client'

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

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const productId = params?.id ?? ''
  const router = useRouter()
  const queryClient = useQueryClient()
  const { promoBar, headerProps, footerProps } = useStorefrontChrome()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', productId],
    queryFn: () => productClient.getById(productId),
    enabled: Boolean(productId),
  })

  const addToCart = useMutation({
    mutationFn: (variantId: string) => cartClient.addItem(variantId, 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      router.push('/cart')
    },
  })

  if (isLoading || !data) {
    return (
      <ProductDetailLayout
        promoBar={promoBar}
        header={<StorefrontHeader {...headerProps} />}
        footer={<StorefrontFooter {...footerProps} />}
        title={isError ? 'Product unavailable' : 'Loading...'}
        price={0}
        breadcrumb={
          <span>
            <a href="/" className="hover:underline">Home</a> ·{' '}
            <a href="/products" className="hover:underline">Products</a>
          </span>
        }
        gallery={
          <div className="aspect-square w-full animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-muted)]" />
        }
        description={
          isError ? (
            <p className="text-[var(--text-secondary)]">
              We couldn&apos;t load this product. It may have been removed or is temporarily unavailable.
            </p>
          ) : (
            <div className="space-y-3">
              <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--surface-muted)]" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--surface-muted)]" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-[var(--surface-muted)]" />
            </div>
          )
        }
      />
    )
  }

  const galleryImages = (data.images.length > 0 ? data.images : [PLACEHOLDER_IMAGE]).map(
    (src, i) => ({ id: `${data.id}-${i}`, src, alt: `${data.name} image ${i + 1}` }),
  )

  const totalStock = (data.variants ?? []).reduce(
    (acc, v) => acc + Math.max(0, v.stock - v.reservedStock),
    0,
  )
  const stockStatus = totalStock === 0 ? 'out-of-stock' : totalStock < 10 ? 'low-stock' : 'in-stock'

  const primaryVariantId = data.variants?.[0]?.id

  return (
    <ProductDetailLayout
      promoBar={promoBar}
      header={<StorefrontHeader {...headerProps} />}
      footer={<StorefrontFooter {...footerProps} />}
      breadcrumb={
        <span>
          <a href="/" className="hover:underline">Home</a> ·{' '}
          <a href="/products" className="hover:underline">Products</a> · {data.name}
        </span>
      }
      title={data.name}
      brand={data.sellerId}
      price={data.price}
      rating={data.rating || undefined}
      reviewCount={data.reviewCount || undefined}
      status={stockStatus}
      statusCount={totalStock}
      gallery={
        <ProductGallery images={galleryImages}>
          <ProductGalleryThumbnails />
          <ProductGalleryMain />
        </ProductGallery>
      }
      description={
        data.description ? (
          <div className="prose prose-sm max-w-none whitespace-pre-line text-[var(--text-secondary)]">
            {data.description}
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
