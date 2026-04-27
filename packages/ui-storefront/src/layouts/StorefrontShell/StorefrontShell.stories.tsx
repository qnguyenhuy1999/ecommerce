import type { Meta } from '@storybook/react'

import { StorefrontFooter } from '../../layouts/StorefrontFooter/StorefrontFooter'
import { StorefrontHeader } from '../../layouts/StorefrontHeader/StorefrontHeader'
import { StorefrontShell } from './StorefrontShell'

const meta = {
  title: 'Layouts/StorefrontShell',
  component: StorefrontShell,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof StorefrontShell>

export default meta

export const Default = {
  render: () => (
    <StorefrontShell>
      <StorefrontShell.Header>
        <StorefrontHeader cartCount={2} onCartClick={() => {}} />
      </StorefrontShell.Header>
      <StorefrontShell.Main>
        <div style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
            Featured Products
          </h2>
          <p style={{ color: 'var(--muted-foreground)' }}>
            Browse our latest collection of products.
          </p>
        </div>
      </StorefrontShell.Main>
      <StorefrontShell.Footer>
        <StorefrontFooter />
      </StorefrontShell.Footer>
    </StorefrontShell>
  ),
}

export const WithoutHeader = {
  render: () => (
    <StorefrontShell>
      <StorefrontShell.Main>
        <div style={{ padding: '2rem' }}>
          <p>No header in this layout.</p>
        </div>
      </StorefrontShell.Main>
      <StorefrontShell.Footer>
        <StorefrontFooter />
      </StorefrontShell.Footer>
    </StorefrontShell>
  ),
}

export const WithoutFooter = {
  render: () => (
    <StorefrontShell>
      <StorefrontShell.Header>
        <StorefrontHeader cartCount={0} onCartClick={() => {}} />
      </StorefrontShell.Header>
      <StorefrontShell.Main>
        <div style={{ padding: '2rem' }}>
          <p>No footer in this layout.</p>
        </div>
      </StorefrontShell.Main>
    </StorefrontShell>
  ),
}

export const Bare = {
  render: () => (
    <StorefrontShell>
      <StorefrontShell.Main>
        <div style={{ padding: '2rem' }}>
          <p>Minimal shell with only content.</p>
        </div>
      </StorefrontShell.Main>
    </StorefrontShell>
  ),
}
