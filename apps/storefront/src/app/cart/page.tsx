'use client'

import { useRouter } from 'next/navigation'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { cartClient } from '@ecom/api-client'

import { CartPageLayout, StorefrontFooter, StorefrontHeader } from '@ecom/ui-storefront'
import type { CartItemProps } from '@ecom/ui-storefront'

import { useStorefrontChrome } from '@/components/storefront-chrome'
import type { CartEnvelope, CartItemView } from '@/lib/cart-types'

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

export default function CartPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { promoBar, headerProps, footerProps } = useStorefrontChrome()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => (await cartClient.get()) as CartEnvelope,
  })

  const cart = data?.data

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartClient.updateItem(itemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => cartClient.removeItem(itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const items: CartItemProps[] = (cart?.items ?? []).map(toCartItemProps)
  const subtotal = cart?.subtotal ?? 0
  const shipping: 'free' | 'calculated' = subtotal > 100 ? 'free' : 'calculated'
  const total = subtotal

  const cartCount = cart?.itemCount ?? 0
  const headerWithCount = { ...headerProps, cartCount }

  return (
    <CartPageLayout
      promoBar={promoBar}
      header={<StorefrontHeader {...headerWithCount} />}
      footer={<StorefrontFooter {...footerProps} />}
      items={items}
      subtotal={subtotal}
      shipping={shipping}
      total={total}
      freeShippingThreshold={100}
      onCheckout={() => router.push('/checkout')}
      onUpdateQuantity={(id, quantity) => updateMutation.mutate({ itemId: id, quantity })}
      onRemoveItem={(id) => removeMutation.mutate(id)}
      emptyState={
        isLoading ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--border-default)] border-t-[var(--action-primary)]" />
            <p className="text-[var(--text-secondary)]">Loading your cart...</p>
          </div>
        ) : isError ? (
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
