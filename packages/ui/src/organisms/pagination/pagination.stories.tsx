import type { Meta, StoryObj } from '@storybook/react'
import { Pagination } from './index'

const meta = {
  title: 'Organisms/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  args: {
    page: 5,
    totalPages: 20,
    onPageChange: () => {},
  },
}

export const FirstPage = {
  args: {
    page: 1,
    totalPages: 20,
    onPageChange: () => {},
  },
}

export const LastPage = {
  args: {
    page: 20,
    totalPages: 20,
    onPageChange: () => {},
  },
}

export const FewPages = {
  args: {
    page: 2,
    totalPages: 4,
    onPageChange: () => {},
  },
}

export const ControlledDemo = {
  render: () => {
    const [page, setPage] = (window as any).__page
      ? [
          (window as any).__page,
          (v: number) => {
            ;(window as any).__page = v
          },
        ]
      : [1, (v: number) => {}]
    return (
      <Pagination
        page={page}
        totalPages={10}
        onPageChange={(p) => {
          /* controlled */
        }}
      />
    )
  },
}
