'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { cartClient } from '@ecom/api-client'

import { CartPageLayout, StorefrontFooter, StorefrontHeader } from '@ecom/ui-storefront'
import type { CartItemProps } from '@ecom/ui-storefront'

import { useStorefrontChrome } from '@/components/storefront-chrome'
import type { CartEnvelope, CartItemView, CartView as CartViewModel } from '@/lib/cart-types'

const CART_ITEM_PLACEHOLDER =
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop'

function toCartItemProps(item: CartItemView): CartItemProps {
  const variantLabel = Object.values(item.variant.attributes ?? {}).join(' / ')
  return {
    id: item.id,
    title: item.variant.product.name,
    price: item.variant.effectivePrice,
    image: item.variant.product.images?.[0] ?? CART_ITEM_PLACEHOLDER,
    quantity: item.quantity,
    variant: variantLabel || undefined,
  }
}

export interface CartViewProps {
  initialCart: CartViewModel
}

/**
 * Client island for the cart page. The initial cart is fetched on the server
 * via cookie-forwarded SSR and seeded into react-query as `initialData` —
 * subsequent mutations (quantity updates, removals) round-trip through the
 * client and re-invalidate the query.
 */
export function CartView({ initialCart }: CartViewProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data, isError } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => (await cartClient.get()) as CartEnvelope,
    initialData: { success: true, data: initialCart } satisfies CartEnvelope,
  })

  const cart = data.data
  const cartCount = cart?.itemCount ?? 0

  const { promoBar, headerProps, footerProps } = useStorefrontChrome({ cartCount })

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartClient.updateItem(itemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => cartClient.removeItem(itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const items: CartItemProps[] = React.useMemo(
    () => (cart?.items ?? []).map(toCartItemProps),
    [cart?.items],
  )
  const subtotal = cart?.subtotal ?? 0
  const shipping: 'free' | 'calculated' = subtotal > 100 ? 'free' : 'calculated'

  return (
    <CartPageLayout
      promoBar={promoBar}
      header={<StorefrontHeader {...headerProps} />}
      footer={<StorefrontFooter {...footerProps} />}
      items={items}
      subtotal={subtotal}
      shipping={shipping}
      total={subtotal}
      freeShippingThreshold={100}
      onCheckout={() => router.push('/checkout')}
      onUpdateQuantity={(id, quantity) => updateMutation.mutate({ itemId: id, quantity })}
      onRemoveItem={(id) => removeMutation.mutate(id)}
      emptyState={
        isError ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <h2 className="text-xl font-semibold">Sign in to see your cart</h2>
            <p className="text-[var(--text-secondary)]">
              Your cart is tied to your account. Sign in to view saved items and continue checkout.
            </p>
          </div>
        ) : undefined
      }
    />
  )
}

/** Server-render-friendly skeleton for streaming. */
export function CartViewSkeleton() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8">
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-[var(--surface-muted)]" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-muted)]"
            />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-muted)]" />
      </div>
    </div>
  )
}
