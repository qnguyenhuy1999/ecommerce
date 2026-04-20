import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Pagination } from './Pagination'

const meta: Meta<typeof Pagination> = {
  title: 'organisms/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Pagination>

export const Default: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [page, setPage] = React.useState(1)
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
  },
}

export const FirstPage: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [page, setPage] = React.useState(1)
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
  },
}

export const MiddlePage: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [page, setPage] = React.useState(4)
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
  },
}

export const LastPage: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [page, setPage] = React.useState(10)
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
  },
}

export const FewPages: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [page, setPage] = React.useState(2)
    return <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />
  },
}

export const ManyPages: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [page, setPage] = React.useState(7)
    return <Pagination currentPage={page} totalPages={25} onPageChange={setPage} />
  },
}

export const Interactive: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [page, setPage] = React.useState(3)
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">Page {page} of 12 — click any button to interact</p>
        <Pagination currentPage={page} totalPages={12} onPageChange={setPage} />
      </div>
    )
  },
}
