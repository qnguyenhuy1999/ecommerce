import type { Meta, StoryObj } from '@storybook/react'
import { StorefrontFooter } from '../../layouts/storefront-footer'
import { StorefrontHeader } from '../../layouts/storefront-header'
import { StorefrontShell } from './index'

const meta = {
  title: 'Layouts/StorefrontShell',
  component: StorefrontShell,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof StorefrontShell>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  render: () => (
    <StorefrontShell
      header={<StorefrontHeader cartCount={2} onCartClick={() => {}} />}
      footer={<StorefrontFooter />}
    >
      <div style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
          Featured Products
        </h2>
        <p style={{ color: 'var(--muted-foreground)' }}>
          Browse our latest collection of products.
        </p>
      </div>
    </StorefrontShell>
  ),
}

export const WithoutHeader = {
  render: () => (
    <StorefrontShell footer={<StorefrontFooter />}>
      <div style={{ padding: '2rem' }}>
        <p>No header in this layout.</p>
      </div>
    </StorefrontShell>
  ),
}

export const WithoutFooter = {
  render: () => (
    <StorefrontShell header={<StorefrontHeader cartCount={0} onCartClick={() => {}} />}>
      <div style={{ padding: '2rem' }}>
        <p>No footer in this layout.</p>
      </div>
    </StorefrontShell>
  ),
}

export const Bare = {
  render: () => (
    <StorefrontShell>
      <div style={{ padding: '2rem' }}>
        <p>Minimal shell with only content.</p>
      </div>
    </StorefrontShell>
  ),
}
