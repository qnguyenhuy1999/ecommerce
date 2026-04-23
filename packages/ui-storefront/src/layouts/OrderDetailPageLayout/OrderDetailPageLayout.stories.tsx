import type { Meta, StoryObj } from '@storybook/react'

import { OrderDetailPageLayout } from './OrderDetailPageLayout'

const SHIPPING = {
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
    productName: 'Sony WH-1000XM5',
    variantSku: 'SONY-BLK',
    attributes: { Color: 'Black' },
    quantity: 1,
    unitPrice: 349.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
  },
  {
    id: '2',
    productName: 'USB-C Cable',
    variantSku: 'USB-2M',
    attributes: {},
    quantity: 2,
    unitPrice: 19.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
  },
]
const TIMELINE = [
  { id: '1', label: 'Order Placed', date: 'Apr 23, 10:32 AM', status: 'complete' as const },
  { id: '2', label: 'Payment Confirmed', date: 'Apr 23, 10:35 AM', status: 'complete' as const },
  { id: '3', label: 'Processing', status: 'current' as const },
  { id: '4', label: 'Shipped', status: 'pending' as const },
  { id: '5', label: 'Delivered', description: 'Est. Apr 26–28', status: 'pending' as const },
]

const meta: Meta<typeof OrderDetailPageLayout> = {
  title: 'Layouts/OrderDetailPageLayout',
  component: OrderDetailPageLayout,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof OrderDetailPageLayout>

export const Default: Story = {
  args: {
    orderDetail: {
      orderNumber: 'ORD-20240423-001',
      status: 'PROCESSING',
      createdAt: 'April 23, 2024',
      subtotal: 389.97,
      shippingFee: 0,
      totalAmount: 389.97,
      shippingAddress: SHIPPING,
      subOrders: [{ id: 'sub1', storeName: 'Sony Official', status: 'PROCESSING', items: ITEMS, subtotal: 389.97 }],
      timelineSteps: TIMELINE,
      paymentMethod: { label: 'Visa', last4: '4242' },
      onBack: () => alert('back'),
    },
  },
}
