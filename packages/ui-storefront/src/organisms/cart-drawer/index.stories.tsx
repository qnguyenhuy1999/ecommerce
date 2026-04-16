import type { Meta, StoryObj } from '@storybook/react'
import { CartDrawer } from './index'

const SAMPLE_ITEMS = [
  {
    id: 'item-1',
    title: 'Wireless Noise-Cancelling Headphones',
    price: 299.0,
    originalPrice: 349.99,
    image: 'https://picsum.photos/seed/cd1/200/300',
    quantity: 1,
    variant: 'Midnight Black',
  },
  {
    id: 'item-2',
    title: 'Premium Leather Running Shoes',
    price: 149.0,
    image: 'https://picsum.photos/seed/cd2/200/300',
    quantity: 2,
    variant: 'US 10 / White',
  },
  {
    id: 'item-3',
    title: 'Smart Fitness Watch Pro',
    price: 199.0,
    image: 'https://picsum.photos/seed/cd3/200/300',
    quantity: 1,
    options: { Color: 'Midnight Black', Size: '41mm' },
  },
]

const meta: Meta<typeof CartDrawer> = {
  title: 'ui-storefront/organisms/CartDrawer',
  component: CartDrawer,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CartDrawer>

export const OpenWithItems: Story = {
  render: () => (
    <CartDrawer
      open={true}
      onOpenChange={() => {}}
      items={SAMPLE_ITEMS}
      subtotal={846.0}
      freeShippingThreshold={100}
      onCheckout={() => console.log('Checkout')}
      onUpdateQuantity={(id, qty) => console.log('Update quantity', id, qty)}
      onRemoveItem={(id) => console.log('Remove item', id)}
    />
  ),
}

export const OpenEmpty: Story = {
  render: () => (
    <CartDrawer
      open={true}
      onOpenChange={() => {}}
      items={[]}
      subtotal={0}
      freeShippingThreshold={100}
      onCheckout={() => console.log('Checkout')}
    />
  ),
}

export const NearFreeShipping: Story = {
  render: () => (
    <CartDrawer
      open={true}
      onOpenChange={() => {}}
      items={[
        {
          id: 'item-1',
          title: 'Portable Bluetooth Speaker',
          price: 89.99,
          image: 'https://picsum.photos/seed/cd4/200/300',
          quantity: 1,
        },
      ]}
      subtotal={89.99}
      freeShippingThreshold={100}
      onCheckout={() => console.log('Checkout')}
    />
  ),
}

export const FreeShippingUnlocked: Story = {
  render: () => (
    <CartDrawer
      open={true}
      onOpenChange={() => {}}
      items={[
        {
          id: 'item-1',
          title: 'Wireless Headphones',
          price: 299.0,
          image: 'https://picsum.photos/seed/cd5/200/300',
          quantity: 1,
        },
      ]}
      subtotal={299.0}
      freeShippingThreshold={100}
      onCheckout={() => console.log('Checkout')}
    />
  ),
}

export const MultipleItemsHighQuantity: Story = {
  render: () => (
    <CartDrawer
      open={true}
      onOpenChange={() => {}}
      items={[
        ...SAMPLE_ITEMS,
        {
          id: 'item-4',
          title: 'Stainless Steel Water Bottle',
          price: 24.99,
          image: 'https://picsum.photos/seed/cd6/200/300',
          quantity: 5,
          variant: '32oz / Silver',
        },
      ]}
      subtotal={966.95}
      freeShippingThreshold={100}
      onCheckout={() => console.log('Checkout')}
    />
  ),
}
