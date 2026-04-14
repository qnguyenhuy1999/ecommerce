import type { Meta } from '@storybook/react'

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
    const __page = (globalThis as Record<string, unknown>).__page
    const page: number = __page !== undefined ? (__page as number) : 1
    return (
      <Pagination
        page={page}
        totalPages={10}
        onPageChange={() => {
          /* controlled */
        }}
      />
    )
  },
}
