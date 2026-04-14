import type { Meta } from '@storybook/react'

import { AdminLayout } from './index'

const meta = {
  title: 'Layouts/AdminLayout',
  component: AdminLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AdminLayout>

export default meta

export const Default = {
  render: () => (
    <AdminLayout
      sidebar={<div style={{ padding: '1rem', fontWeight: 700 }}>Sidebar</div>}
      header={
        <div style={{ padding: '0 1.5rem' }}>
          <span style={{ fontWeight: 600 }}>Admin Header</span>
        </div>
      }
    >
      <div style={{ padding: '1rem' }}>
        <p>Main content area — your dashboard content goes here.</p>
      </div>
    </AdminLayout>
  ),
}

export const WithoutSidebar = {
  render: () => (
    <AdminLayout
      header={
        <div style={{ padding: '0 1.5rem' }}>
          <span style={{ fontWeight: 600 }}>Full-width Header</span>
        </div>
      }
    >
      <div style={{ padding: '1rem' }}>
        <p>Content without a sidebar.</p>
      </div>
    </AdminLayout>
  ),
}

export const WithoutHeader = {
  render: () => (
    <AdminLayout sidebar={<div style={{ padding: '1rem', fontWeight: 700 }}>Sidebar Only</div>}>
      <div style={{ padding: '1rem' }}>
        <p>Content with sidebar but no header.</p>
      </div>
    </AdminLayout>
  ),
}

export const Bare = {
  render: () => (
    <AdminLayout>
      <div style={{ padding: '1rem' }}>
        <p>Minimal layout with just content.</p>
      </div>
    </AdminLayout>
  ),
}
