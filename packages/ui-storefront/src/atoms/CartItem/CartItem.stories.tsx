import type { Meta, StoryObj } from '@storybook/react'

import { CartItem } from './CartItem'

const meta = {
  title: 'atoms/CartItem',
  component: CartItem,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-72 space-y-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CartItem>

export default meta
type Story = StoryObj<typeof CartItem>

const BASE = {
  id: 'item-1',
  title: 'Aspirin 100mg Tablets',
  price: 5.99,
  originalPrice: 3.99,
  quantity: 3,
  variant: '100mg',
  image: 'https://picsum.photos/seed/aspirin/200',
  onUpdateQuantity: () => {},
  onRemove: () => {},
  onWishlist: () => {},
  onSave: () => {},
}

export const RxNeeded: Story = {
  args: { ...BASE, rxStatus: 'rx-needed' },
}

export const OTC: Story = {
  args: {
    ...BASE,
    id: 'item-2',
    title: 'Amoxicillin 500mg Capsule R5',
    price: 7.99,
    originalPrice: 3.99,
    variant: '250mg',
    quantity: 1,
    image: 'https://picsum.photos/seed/amoxicillin/200',
    rxStatus: 'otc',
  },
}

export const RxFree: Story = {
  args: {
    ...BASE,
    id: 'item-3',
    title: 'Claritin Allergy Relief Syrup DX-2',
    price: 1500.99,
    originalPrice: 1154.99,
    variant: '999kg',
    quantity: 400,
    image: 'https://picsum.photos/seed/claritin/200',
    rxStatus: 'rx-free',
  },
}

export const NoBadge: Story = {
  args: {
    ...BASE,
    rxStatus: undefined,
    title: 'Generic Paracetamol 500mg',
  },
}

export const Wishlisted: Story = {
  args: { ...BASE, rxStatus: 'rx-needed', wishlisted: true },
}

export const WithoutImage: Story = {
  args: { ...BASE, rxStatus: 'otc', image: '' },
}

export const NoVariant: Story = {
  args: {
    ...BASE,
    rxStatus: 'rx-free',
    variant: undefined,
    title: 'Ventolin HFA Inhaler 2025 Version',
    price: 99.99,
    originalPrice: 3.99,
    quantity: 1,
    image: 'https://picsum.photos/seed/ventolin/200',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="w-72 space-y-4">
      <CartItem {...BASE} rxStatus="rx-needed" />
      <CartItem
        {...BASE}
        id="2"
        rxStatus="otc"
        variant="250mg"
        title="Amoxicillin 500mg Capsule R5"
        price={7.99}
        originalPrice={3.99}
        quantity={1}
        image="https://picsum.photos/seed/amoxicillin/200"
      />
      <CartItem
        {...BASE}
        id="3"
        rxStatus="rx-free"
        variant="999kg"
        title="Claritin Allergy Relief Syrup DX-2"
        price={1500.99}
        originalPrice={1154.99}
        quantity={400}
        image="https://picsum.photos/seed/claritin/200"
      />
    </div>
  ),
}
