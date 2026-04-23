import type { Meta } from '@storybook/react'
import { TrendingSearchSection } from './TrendingSearchSection'

const meta = {
  title: 'Organisms/TrendingSearchSection',
  component: TrendingSearchSection,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TrendingSearchSection>

export default meta

export const Default = {
  args: {
    keywords: [
      { label: 'Wireless Earbuds', href: '#' },
      { label: 'Running Shoes', href: '#' },
      { label: 'Mechanical Keyboard', href: '#' },
      { label: 'OLED TV', href: '#' },
      { label: 'Protein Powder', href: '#' },
      { label: 'Smart Watch', href: '#' },
      { label: 'Air Fryer', href: '#' },
      { label: 'Office Chair', href: '#' },
    ],
  },
}
