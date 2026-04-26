'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { cartClient, orderClient } from '@ecom/api-client'

import {
  AddressForm,
  CheckoutPageLayout,
  OrderSummary,
  PaymentForm,
  StorefrontFooter,
  StorefrontHeader,
} from '@ecom/ui-storefront'
import type { CheckoutStepId, ShippingAddress } from '@ecom/ui-storefront'

import { useStorefrontChrome } from '@/components/storefront-chrome'
import type { CartEnvelope } from '@/lib/cart-types'

export default function CheckoutPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { promoBar, headerProps, footerProps } = useStorefrontChrome()

  const [currentStep, setCurrentStep] = React.useState<CheckoutStepId>('shipping')
  const [address, setAddress] = React.useState<ShippingAddress | null>(null)

  const { data: cartEnvelope } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => (await cartClient.get()) as CartEnvelope,
  })
  const cart = cartEnvelope?.data

  const checkoutMutation = useMutation({
    mutationFn: () => {
      if (!address) throw new Error('Missing shipping address')
      return orderClient.checkout({ shippingAddress: address }, crypto.randomUUID())
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      router.push(`/account/orders?placed=${order.orderId}`)
    },
  })

  const subtotal = cart?.subtotal ?? 0
  const shipping: 'free' | 'calculated' = subtotal > 100 ? 'free' : 'calculated'
  const total = subtotal

  const orderSummary = (
    <OrderSummary subtotal={subtotal} shipping={shipping} total={total} freeShippingThreshold={100}>
      <OrderSummary.Lines />
      <OrderSummary.Total />
    </OrderSummary>
  )

  return (
    <CheckoutPageLayout
      promoBar={promoBar}
      header={<StorefrontHeader {...headerProps} />}
      footer={<StorefrontFooter {...footerProps} />}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      orderSummary={orderSummary}
      shippingForm={
        <AddressForm
          defaultValues={address ?? undefined}
          onSubmit={(value) => {
            setAddress(value)
            setCurrentStep('payment')
          }}
        />
      }
      paymentForm={
        <PaymentForm
          submitLabel="Continue to review"
          onSubmit={() => setCurrentStep('review')}
        />
      }
      reviewSection={
        <div className="space-y-[var(--space-6)]">
          <h3 className="text-[length:var(--text-base)] font-semibold">Review your order</h3>
          {address && (
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] p-[var(--space-4)]">
              <p className="text-[length:var(--text-sm)] font-semibold">Ship to</p>
              <p className="text-[length:var(--text-sm)] text-[var(--text-secondary)]">
                {address.fullName} — {address.addressLine1}
                {address.addressLine2 ? `, ${address.addressLine2}` : ''}, {address.city} {address.postalCode},{' '}
                {address.country}
              </p>
            </div>
          )}
          <div className="flex items-center justify-between gap-[var(--space-3)]">
            <button
              type="button"
              className="text-[length:var(--text-sm)] text-[var(--text-secondary)] underline"
              onClick={() => setCurrentStep('payment')}
            >
              Back to payment
            </button>
            <button
              type="button"
              disabled={!address || checkoutMutation.isPending}
              className="rounded-[var(--radius-md)] bg-[var(--action-primary)] px-[var(--space-5)] py-[var(--space-2)] text-[var(--action-primary-foreground)] disabled:opacity-50"
              onClick={() => checkoutMutation.mutate()}
            >
              {checkoutMutation.isPending ? 'Placing order...' : 'Place order'}
            </button>
          </div>
          {checkoutMutation.isError && (
            <p className="text-[length:var(--text-sm)] text-[var(--intent-danger)]">
              We couldn&apos;t place your order. Please try again.
            </p>
          )}
        </div>
      }
      confirmationSection={
        <div className="text-center space-y-[var(--space-4)]">
          <h2 className="text-[length:var(--text-2xl)] font-bold">Thank you for your order!</h2>
          <p className="text-[var(--text-secondary)]">
            We&apos;ve emailed you a receipt. Track shipping progress from your orders page.
          </p>
          <button
            type="button"
            className="rounded-[var(--radius-md)] bg-[var(--action-primary)] px-[var(--space-5)] py-[var(--space-2)] text-[var(--action-primary-foreground)]"
            onClick={() => router.push('/account/orders')}
          >
            View orders
          </button>
        </div>
      }
    />
  )
}
