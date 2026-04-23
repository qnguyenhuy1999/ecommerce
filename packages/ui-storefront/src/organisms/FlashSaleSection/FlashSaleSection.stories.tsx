import type { Meta } from '@storybook/react'
import { FlashSaleSection } from './FlashSaleSection'

const meta = {
  title: 'Organisms/FlashSaleSection',
  component: FlashSaleSection,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof FlashSaleSection>

export default meta

// Helper to get a date 4 hours from now
const getFutureDate = () => {
  const d = new Date()
  d.setHours(d.getHours() + 4)
  return d
}

export const Default = {
  args: {
    title: 'Flash Sale',
    targetDate: getFutureDate(),
    viewAllHref: '/flash-sale',
    onAddToCart: () => alert('Added to cart'),
    products: [
      {
        id: '1',
        title: 'Wireless Earbuds',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        price: 49,
        originalPrice: 129,
        badge: '-62%',
        badgeVariant: 'destructive',
        buyCount: 1234,
      },
      {
        id: '2',
        title: 'Smart Watch',
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
        price: 99,
        originalPrice: 199,
        badge: '-50%',
        badgeVariant: 'destructive',
        buyCount: 562,
      },
      {
        id: '3',
        title: 'Running Shoes',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
        price: 79,
        originalPrice: 159,
        badge: '-50%',
        badgeVariant: 'destructive',
      },
      {
        id: '4',
        title: 'Minimalist Backpack',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
        price: 39,
        originalPrice: 79,
        badge: '-50%',
        badgeVariant: 'destructive',
      },
    ],
  },
}
