import type { Meta, StoryObj } from '@storybook/react'
import { TrustBadge, TrustBadgeGroup } from './TrustBadge'

const meta: Meta<typeof TrustBadge> = {
  title: 'atoms/TrustBadge',
  component: TrustBadge,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TrustBadge>

export const VerifiedSeller: Story = {
  args: {
    type: 'verified-seller',
  },
}

export const FreeShipping: Story = {
  args: {
    type: 'free-shipping',
  },
}

export const SecureCheckout: Story = {
  args: {
    type: 'secure-checkout',
  },
}

export const FreeReturns: Story = {
  args: {
    type: 'free-returns',
  },
}

export const Authentic: Story = {
  args: {
    type: 'authentic',
  },
}

export const SmallSize: Story = {
  args: {
    type: 'free-shipping',
    size: 'sm',
  },
}

export const CustomLabel: Story = {
  args: {
    type: 'verified-seller',
    label: 'Certified by the manufacturer',
  },
}

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      <TrustBadge type="verified-seller" />
      <TrustBadge type="free-shipping" />
      <TrustBadge type="secure-checkout" />
      <TrustBadge type="free-returns" />
      <TrustBadge type="authentic" />
    </div>
  ),
}

export const GroupDotSeparator: Story = {
  render: () => (
    <TrustBadgeGroup
      types={['verified-seller', 'free-shipping', 'secure-checkout', 'free-returns', 'authentic']}
      size="sm"
      separator="dot"
    />
  ),
}

export const GroupPipeSeparator: Story = {
  render: () => (
    <TrustBadgeGroup types={['free-shipping', 'free-returns', 'authentic']} size="default" separator="pipe" />
  ),
}

export const GroupNoSeparator: Story = {
  render: () => (
    <TrustBadgeGroup types={['verified-seller', 'free-shipping', 'secure-checkout']} size="default" separator="none" />
  ),
}

export const GroupSmallSize: Story = {
  render: () => (
    <TrustBadgeGroup
      types={['verified-seller', 'free-shipping', 'secure-checkout', 'free-returns', 'authentic']}
      size="sm"
    />
  ),
}
