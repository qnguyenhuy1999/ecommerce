import type { Meta } from '@storybook/react'
import { BrandShowcaseSection } from './BrandShowcaseSection'

const meta = {
  title: 'Organisms/BrandShowcaseSection',
  component: BrandShowcaseSection,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof BrandShowcaseSection>

export default meta

export const Default = {
  args: {
    brands: [
      { name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg', href: '#' },
      { name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg', href: '#' },
      { name: 'Puma', logo: 'https://upload.wikimedia.org/wikipedia/en/4/45/Puma_Logo.svg', href: '#' },
      { name: 'Sony', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Sony_logo.svg', href: '#' },
      { name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', href: '#' },
      { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', href: '#' },
    ],
  },
}
