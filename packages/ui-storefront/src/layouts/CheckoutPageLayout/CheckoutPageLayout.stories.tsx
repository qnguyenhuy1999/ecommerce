import type { Meta, StoryObj } from '@storybook/react'

import { CheckoutPageLayout } from './CheckoutPageLayout'
import { AddressForm } from '../../molecules/AddressForm/AddressForm'
import { PaymentForm } from '../../molecules/PaymentForm/PaymentForm'
import { OrderSummary } from '../../molecules/OrderSummary/OrderSummary'
import { OrderReviewCard } from '../../molecules/OrderReviewCard/OrderReviewCard'
import { OrderConfirmation } from '../../organisms/OrderConfirmation/OrderConfirmation'

const ADDRESS = {
  fullName: 'Jane Doe',
  phone: '+65 9123 4567',
  addressLine1: '123 Orchard Road',
  city: 'Singapore',
  postalCode: '238858',
  country: 'SG',
}
const ITEMS = [
  {
    id: '1',
    title: 'Sony Headphones',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
    quantity: 1,
  },
]
const TOTALS = { subtotal: 349.99, shipping: 'free' as const, total: 349.99 }

const SUMMARY = <OrderSummary subtotal={349.99} shipping="free" total={349.99} freeShippingThreshold={300} />

const meta: Meta<typeof CheckoutPageLayout> = {
  title: 'Layouts/CheckoutPageLayout',
  component: CheckoutPageLayout,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof CheckoutPageLayout>

export const Shipping: Story = {
  args: {
    currentStep: 'shipping',
    shippingForm: <AddressForm onSubmit={(d) => alert(JSON.stringify(d))} />,
    orderSummary: SUMMARY,
  },
}

export const Payment: Story = {
  args: {
    currentStep: 'payment',
    paymentForm: <PaymentForm onSubmit={(d) => alert(JSON.stringify(d))} />,
    orderSummary: SUMMARY,
  },
}

export const Review: Story = {
  args: {
    currentStep: 'review',
    reviewSection: (
      <OrderReviewCard
        shippingAddress={ADDRESS}
        paymentMethod={{ label: 'Visa Credit Card', last4: '4242' }}
        items={ITEMS}
        totals={TOTALS}
        onEdit={(s) => alert(`Edit: ${s}`)}
      />
    ),
    orderSummary: SUMMARY,
  },
}

export const Confirmation: Story = {
  args: {
    currentStep: 'confirmation',
    confirmationSection: (
      <OrderConfirmation
        orderNumber="ORD-20240423-001"
        email="jane@example.com"
        estimatedDelivery="Apr 26–28, 2024"
        items={ITEMS}
        totals={TOTALS}
        onContinueShopping={() => alert('continue')}
        onTrackOrder={() => alert('track')}
      />
    ),
  },
}
