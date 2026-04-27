'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { cartClient, orderClient, paymentClient } from '@ecom/api-client'

import { Button } from '@ecom/ui'
import {
  AddressForm,
  CheckoutPageLayout,
  OrderSummary,
  StorefrontFooter,
  StorefrontHeader,
} from '@ecom/ui-storefront'
import type { CheckoutStepId, ShippingAddress } from '@ecom/ui-storefront'

import { useStorefrontChrome } from '@/components/storefront-chrome'
import type { CartEnvelope } from '@/lib/cart-types'

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

export default function CheckoutPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { promoBar, headerProps, footerProps } = useStorefrontChrome()

  const [currentStep, setCurrentStep] = React.useState<CheckoutStepId>('shipping')
  const [address, setAddress] = React.useState<ShippingAddress | null>(null)
  const [pendingOrderId, setPendingOrderId] = React.useState<string | null>(null)
  const [clientSecret, setClientSecret] = React.useState<string | null>(null)
  const [paymentError, setPaymentError] = React.useState<string | null>(null)

  const { data: cartEnvelope } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => (await cartClient.get()) as CartEnvelope,
  })
  const cart = cartEnvelope?.data

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      if (!address) throw new Error('Missing shipping address')
      const order = await orderClient.checkout({ shippingAddress: address }, crypto.randomUUID())
      const intent = await paymentClient.createIntent(
        { orderId: order.orderId },
        crypto.randomUUID(),
      )
      return { order, intent }
    },
    onSuccess: ({ order, intent }) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      setPendingOrderId(order.orderId)
      setClientSecret(intent.clientSecret)
      setPaymentError(null)
      setCurrentStep('payment')
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
        <PaymentStep
          clientSecret={clientSecret}
          orderId={pendingOrderId}
          onCreateOrder={() => checkoutMutation.mutate()}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            setCurrentStep('confirmation')
          }}
          error={
            paymentError ??
            (checkoutMutation.isError ? 'Unable to create payment. Please try again.' : null)
          }
          setError={setPaymentError}
          loading={checkoutMutation.isPending}
          onBack={() => setCurrentStep('shipping')}
        />
      }
      reviewSection={
        <div className="space-y-6">
          <h3 className="text-[length:var(--text-base)] font-semibold">Review your order</h3>
          <p className="text-[length:var(--text-sm)] text-[var(--text-secondary)]">
            Payment details are collected securely on the payment step before this final review.
          </p>
          {address && (
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] p-4">
              <p className="text-sm font-semibold">Ship to</p>
              <p className="text-sm text-[var(--text-secondary)]">
                {address.fullName} — {address.addressLine1}
                {address.addressLine2 ? `, ${address.addressLine2}` : ''}, {address.city}{' '}
                {address.postalCode}, {address.country}
              </p>
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              className="text-sm text-[var(--text-secondary)] underline"
              onClick={() => setCurrentStep('payment')}
            >
              Back to payment
            </button>
            <button
              type="button"
              disabled={!address || checkoutMutation.isPending}
              className="rounded-[var(--radius-md)] bg-[var(--action-primary)] px-5 py-2 text-[var(--action-primary-foreground)] disabled:opacity-50"
              onClick={() => checkoutMutation.mutate()}
            >
              {checkoutMutation.isPending ? 'Placing order...' : 'Place order'}
            </button>
          </div>
          {checkoutMutation.isError && (
            <p className="text-sm text-[var(--intent-danger)]">
              We couldn&apos;t place your order. Please try again.
            </p>
          )}
        </div>
      }
      confirmationSection={
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Thank you for your order!</h2>
          <p className="text-[var(--text-secondary)]">
            We&apos;ve emailed you a receipt. Track shipping progress from your orders page.
          </p>
          <button
            type="button"
            className="rounded-[var(--radius-md)] bg-[var(--action-primary)] px-[var(--space-5)] py-[var(--space-2)] text-[var(--action-primary-foreground)]"
            onClick={() =>
              router.push(
                pendingOrderId ? `/account/orders?placed=${pendingOrderId}` : '/account/orders',
              )
            }
          >
            View orders
          </button>
        </div>
      }
    />
  )
}

function PaymentStep({
  clientSecret,
  orderId,
  onCreateOrder,
  onSuccess,
  error,
  setError,
  loading,
  onBack,
}: {
  clientSecret: string | null
  orderId: string | null
  onCreateOrder: () => void
  onSuccess: () => void
  error: string | null
  setError: (message: string | null) => void
  loading: boolean
  onBack: () => void
}) {
  if (!stripePromise) {
    return (
      <div className="space-y-[var(--space-4)]">
        <p className="text-[length:var(--text-sm)] text-[var(--intent-danger)]">
          Stripe publishable key is not configured.
        </p>
        <Button type="button" variant="outline" onClick={onBack}>
          Back to shipping
        </Button>
      </div>
    )
  }

  if (!clientSecret || !orderId) {
    return (
      <div className="space-y-[var(--space-4)]">
        <p className="text-[length:var(--text-sm)] text-[var(--text-secondary)]">
          Create a pending order to reserve inventory and load the secure Stripe payment form.
        </p>
        <div className="flex items-center justify-between gap-[var(--space-3)]">
          <Button type="button" variant="outline" onClick={onBack}>
            Back to shipping
          </Button>
          <Button type="button" disabled={loading} onClick={onCreateOrder}>
            {loading ? 'Preparing payment…' : 'Continue to payment'}
          </Button>
        </div>
        {error && (
          <p className="text-[length:var(--text-sm)] text-[var(--intent-danger)]">{error}</p>
        )}
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripePaymentForm
        orderId={orderId}
        onSuccess={onSuccess}
        setError={setError}
        error={error}
      />
    </Elements>
  )
}

function StripePaymentForm({
  orderId,
  onSuccess,
  setError,
  error,
}: {
  orderId: string
  onSuccess: () => void
  setError: (message: string | null) => void
  error: string | null
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = React.useState(false)

  return (
    <form
      className="space-y-[var(--space-5)]"
      onSubmit={async (event) => {
        event.preventDefault()
        if (!stripe || !elements) return

        setSubmitting(true)
        setError(null)
        const result = await stripe.confirmPayment({
          elements,
          redirect: 'if_required',
          confirmParams: {
            return_url: `${window.location.origin}/account/orders?placed=${orderId}`,
          },
        })
        setSubmitting(false)

        if (result.error) {
          setError(result.error.message ?? 'Payment failed. Please try again.')
          return
        }

        onSuccess()
      }}
    >
      <PaymentElement />
      {error && <p className="text-[length:var(--text-sm)] text-[var(--intent-danger)]">{error}</p>}
      <Button type="submit" className="w-full" disabled={!stripe || !elements || submitting}>
        {submitting ? 'Confirming payment…' : 'Pay securely'}
      </Button>
      <p className="text-[length:var(--text-xs)] text-[var(--text-tertiary)]">
        Order {orderId} remains pending until the Stripe webhook confirms payment.
      </p>
    </form>
  )
}
