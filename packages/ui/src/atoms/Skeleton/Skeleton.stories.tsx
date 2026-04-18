import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from '../../components/ui/skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'atoms/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  render: () => <Skeleton className="h-32 w-full" />,
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" className="h-10 w-10" />
        <div className="flex flex-col gap-2">
          <Skeleton variant="text" className="h-4 w-48" />
          <Skeleton variant="text" className="h-3 w-32" />
        </div>
      </div>
      <Skeleton variant="rectangular" className="h-24 w-full rounded-[var(--radius-md)]" />
      <Skeleton variant="card" className="h-16 w-full" />
    </div>
  ),
}

export const ProductCardSkeleton: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-xs border rounded-[var(--radius-lg)] p-4">
      <Skeleton variant="rectangular" className="h-36 w-full rounded-[var(--radius-md)]" />
      <Skeleton variant="text" className="h-5 w-3/4" />
      <Skeleton variant="text" className="h-3 w-1/2" />
      <div className="flex justify-between items-center mt-2">
        <Skeleton variant="text" className="h-6 w-20" />
        <Skeleton variant="circular" className="h-8 w-8" />
      </div>
    </div>
  ),
}

export const TableSkeleton: Story = {
  render: () => (
    <div className="flex flex-col gap-2 border rounded-[var(--radius-md)] p-4">
      <div className="flex items-center gap-3 pb-2 border-b">
        <Skeleton variant="circular" className="h-8 w-8" />
        <Skeleton variant="text" className="h-4 w-48" />
        <Skeleton variant="text" className="h-4 w-24 ml-auto" />
        <Skeleton variant="text" className="h-4 w-20" />
      </div>
      <div className="flex items-center gap-3 py-3 border-b">
        <Skeleton variant="circular" className="h-8 w-8" />
        <Skeleton variant="text" className="h-4 w-40" />
        <Skeleton variant="text" className="h-4 w-24 ml-auto" />
        <Skeleton variant="text" className="h-4 w-20" />
      </div>
      <div className="flex items-center gap-3 py-3">
        <Skeleton variant="circular" className="h-8 w-8" />
        <Skeleton variant="text" className="h-4 w-44" />
        <Skeleton variant="text" className="h-4 w-24 ml-auto" />
        <Skeleton variant="text" className="h-4 w-20" />
      </div>
    </div>
  ),
}

export const UserProfileSkeleton: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-sm border rounded-[var(--radius-lg)] p-5">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" className="h-12 w-12" />
        <div className="flex flex-col gap-2">
          <Skeleton variant="text" className="h-4 w-32" />
          <Skeleton variant="text" className="h-3 w-24" />
        </div>
      </div>
      <Skeleton variant="rectangular" className="h-20 w-full rounded-[var(--radius-sm)]" />
      <div className="flex gap-3">
        <Skeleton variant="rectangular" className="h-9 w-24 rounded-[var(--radius-sm)]" />
        <Skeleton variant="rectangular" className="h-9 w-24 rounded-[var(--radius-sm)]" />
      </div>
    </div>
  ),
}
