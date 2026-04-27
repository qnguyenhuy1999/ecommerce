import React from 'react'

import { Lock } from 'lucide-react'

import { cn } from '@ecom/ui'

import { CheckoutStepper } from '../../molecules/CheckoutStepper/CheckoutStepper'
import type { CheckoutStep } from '../../molecules/CheckoutStepper/CheckoutStepper'
import { PageContainer } from '../shared/PageContainer'
import { StorefrontPageShell } from '../shared/StorefrontPageShell'
import type { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import type { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'

export type CheckoutStepId = 'shipping' | 'payment' | 'review' | 'confirmation'

export interface CheckoutPageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  promoBar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  headerProps?: React.ComponentProps<typeof StorefrontHeader>
  footerProps?: React.ComponentProps<typeof StorefrontFooter>
  currentStep: CheckoutStepId
  shippingForm?: React.ReactNode
  paymentForm?: React.ReactNode
  reviewSection?: React.ReactNode
  confirmationSection?: React.ReactNode
  orderSummary?: React.ReactNode
  onStepChange?: (step: CheckoutStepId) => void
}

const CHECKOUT_STEPS: CheckoutStep[] = [
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
  { id: 'confirmation', label: 'Confirmed' },
]

const STEP_CONTENT: Record<CheckoutStepId, string> = {
  shipping: 'Shipping Address',
  payment: 'Payment Details',
  review: 'Review Order',
  confirmation: 'Order Confirmed',
}

function CheckoutPageLayout({
  promoBar,
  header,
  footer,
  headerProps,
  footerProps,
  currentStep,
  shippingForm,
  paymentForm,
  reviewSection,
  confirmationSection,
  orderSummary,
  className,
  ...props
}: CheckoutPageLayoutProps) {
  const isConfirmation = currentStep === 'confirmation'

  const stepContent = {
    shipping: shippingForm,
    payment: paymentForm,
    review: reviewSection,
    confirmation: confirmationSection,
  }

  return (
    <StorefrontPageShell
      className={className}
      promoBar={promoBar}
      header={header}
      footer={footer}
      headerProps={headerProps}
      footerProps={footerProps}
      {...props}
    >
      <PageContainer>
        {/* Secure header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[length:var(--font-size-heading-lg)] font-bold tracking-tight text-[var(--text-primary)]">
            {STEP_CONTENT[currentStep]}
          </h1>
          <span className="flex items-center gap-1.5 text-[length:var(--text-xs)] text-[var(--text-secondary)]">
            <Lock className="w-3.5 h-3.5 text-[var(--intent-success)]" />
            Secure Checkout
          </span>
        </div>

        {/* Stepper */}
        {!isConfirmation && (
          <div className="mb-10">
            <CheckoutStepper steps={CHECKOUT_STEPS} currentStepId={currentStep} />
          </div>
        )}

        {/* Layout: 2-col on desktop, single col on mobile */}
        {isConfirmation ? (
          <div className="py-6">{confirmationSection}</div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
            {/* Form area */}
            <div
              className={cn(
                'rounded-[var(--radius-xl)] border border-[var(--border-subtle)]',
                'bg-[var(--surface-base)] shadow-[var(--elevation-card)]',
                'p-6',
              )}
            >
              <h2 className="text-[length:var(--text-base)] font-semibold text-[var(--text-primary)] mb-6">
                {STEP_CONTENT[currentStep]}
              </h2>
              {stepContent[currentStep]}
            </div>

            {/* Order summary — sticky, anchored below the measured header */}
            {orderSummary && (
              <div className="lg:sticky lg:top-[calc(var(--storefront-header-total)+var(--space-6))]">
                {orderSummary}
              </div>
            )}
          </div>
        )}
      </PageContainer>
    </StorefrontPageShell>
  )
}

export { CheckoutPageLayout }
