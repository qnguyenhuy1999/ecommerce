import type { Meta } from '@storybook/react'
import { TrustBannerSection } from './TrustBannerSection'

const meta = {
  title: 'Organisms/TrustBannerSection',
  component: TrustBannerSection,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TrustBannerSection>

export default meta

export const Default = {
  args: {}, // Uses defaults from the component
}

export const CustomBadges = {
  args: {
    badges: ['verified-seller', 'free-shipping', 'authentic'],
  },
}
