import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { Reviews } from './Reviews'
import { reviewsAnalytics, reviewsPageRows } from './Reviews.fixtures'
import type { ReviewsReplyFilter, ReviewsStatusTab } from './Reviews.types'

const meta: Meta<typeof Reviews> = {
  title: 'pages/Reviews',
  component: Reviews,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    rows: reviewsPageRows,
    analytics: reviewsAnalytics,
  },
}

export default meta

type Story = StoryObj<typeof Reviews>

export const Default: Story = {
  render: (args) => (
    <ConsoleLayout>
      <Reviews {...args} />
    </ConsoleLayout>
  ),
}

export const ControlledFilters: Story = {
  render: (args) => {
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState<ReviewsStatusTab>('ALL')
    const [replyFilter, setReplyFilter] = useState<ReviewsReplyFilter>('ALL')

    return (
      <ConsoleLayout>
        <Reviews
          {...args}
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          replyFilter={replyFilter}
          onReplyFilterChange={setReplyFilter}
        />
      </ConsoleLayout>
    )
  },
}

export const Loading: Story = {
  args: { loading: true },
  render: (args) => (
    <ConsoleLayout>
      <Reviews {...args} />
    </ConsoleLayout>
  ),
}
