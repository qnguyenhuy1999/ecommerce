import type { Meta, StoryObj } from '@storybook/react'
import { ToastProvider, useToast } from './Toast'

const meta: Meta<typeof ToastProvider> = {
  title: 'molecules/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof ToastProvider>

function ToastDemo({ variant }: { variant?: 'default' | 'success' | 'warning' | 'error' | 'info' }) {
  const { addToast } = useToast()
  return (
    <button
      className="px-4 py-2 text-sm rounded border border-input hover:bg-accent transition-colors"
      onClick={() =>
        addToast({
          title: variant === 'default' || !variant ? 'Changes saved' : 'Product updated',
          description:
            variant === 'default' || !variant
              ? 'Your changes have been saved successfully.'
              : variant === 'success'
                ? '"Wireless Headphones Pro" is now live in your store.'
                : variant === 'warning'
                  ? 'Your session will expire in 5 minutes.'
                  : variant === 'error'
                    ? 'Failed to process payment. Please try again.'
                    : 'New features are available in your dashboard.',
          variant,
          action: variant !== 'default' ? { label: 'View', onClick: () => {} } : undefined,
        })
      }>
      Show {variant || 'default'} toast
    </button>
  )
}

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <div className="flex flex-wrap gap-3">
        <ToastDemo variant="default" />
        <ToastDemo variant="success" />
        <ToastDemo variant="warning" />
        <ToastDemo variant="error" />
        <ToastDemo variant="info" />
      </div>
    </ToastProvider>
  ),
}

export const SuccessToast: Story = {
  render: () => (
    <ToastProvider>
      <div className="flex gap-3">
        <ToastDemo variant="success" />
      </div>
    </ToastProvider>
  ),
}

export const ErrorToast: Story = {
  render: () => (
    <ToastProvider>
      <div className="flex gap-3">
        <ToastDemo variant="error" />
      </div>
    </ToastProvider>
  ),
}

export const WithAction: Story = {
  render: () => (
    <ToastProvider>
      <div className="flex gap-3">
        <ToastDemo variant="success" />
      </div>
    </ToastProvider>
  ),
}

export const MultipleToasts: Story = {
  render: () => {
    function MultiDemo() {
      const { addToast } = useToast()
      return (
        <div className="flex flex-wrap gap-3">
          <button
            className="px-4 py-2 text-sm rounded border border-input hover:bg-accent transition-colors"
            onClick={() => {
              addToast({
                title: 'Order confirmed',
                description: 'Order #ORD-2024-1847 has been placed.',
                variant: 'success',
              })
              addToast({ title: 'Payment received', description: '$299.00 credited to your account.', variant: 'info' })
              addToast({
                title: 'Shipping label generated',
                description: 'FedEx tracking number added to order.',
                variant: 'default',
              })
            }}>
            Trigger 3 Toasts
          </button>
        </div>
      )
    }
    return (
      <ToastProvider>
        <MultiDemo />
      </ToastProvider>
    )
  },
}
