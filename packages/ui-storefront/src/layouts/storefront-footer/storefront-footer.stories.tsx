import type { Meta } from '@storybook/react'

import { StorefrontFooter } from './index'

const meta = {
  title: 'Layouts/StorefrontFooter',
  component: StorefrontFooter,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof StorefrontFooter>

export default meta

export const Default = {
  render: () => (
    <div style={{ background: 'var(--background)', borderTop: '1px solid var(--border)' }}>
      <StorefrontFooter />
    </div>
  ),
}
