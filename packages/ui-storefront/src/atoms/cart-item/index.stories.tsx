import type { Meta, StoryObj } from '@storybook/react'
import { CartItem } from './index'

const meta: Meta<typeof CartItem> = {
  title: 'ui-storefront/atoms/CartItem',
  component: CartItem,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CartItem>

export const Default: Story = {
  args: {
    id: '1',
    title: 'Wireless Noise-Cancelling Headphones',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=250&fit=crop',
    quantity: 1,
  },
}

export const WithVariant: Story = {
  args: {
    id: '2',
    title: 'Premium Running Shoes',
    price: 149.99,
    originalPrice: 199.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=250&fit=crop',
    quantity: 2,
    variant: 'Navy / US 10',
  },
}

export const WithOptions: Story = {
  args: {
    id: '3',
    title: 'Smart Fitness Watch',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=250&fit=crop',
    quantity: 1,
    options: { Color: 'Midnight Black', Size: '42mm' },
  },
}

export const QuantityOfThree: Story = {
  args: {
    id: '4',
    title: 'Organic Cotton T-Shirt',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=250&fit=crop',
    quantity: 3,
    options: { Color: 'White', Size: 'M' },
  },
}

export const OnSale: Story = {
  args: {
    id: '5',
    title: 'Leather Crossbody Bag',
    price: 89.99,
    originalPrice: 159.99,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=250&fit=crop',
    quantity: 1,
  },
}