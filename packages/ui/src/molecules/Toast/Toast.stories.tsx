import type { Meta, StoryObj } from '@storybook/react'
import { ToastProvider, useToast } from './Toast'

const meta: Meta<typeof ToastProvider> = {
  title: 'molecules/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof ToastProvider>

function DefaultDemo() {
  const { addToast } = useToast()
  return (
    <div className="flex flex-wrap gap-3">
      <button
        className="px-4 py-2 text-sm font-medium rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-base)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] active:scale-[0.98] transition-all duration-[var(--motion-fast)]"
        onClick={() =>
          addToast({ title: 'Notification', description: 'You have a new notification.', variant: 'default' })
        }>
        Show default toast
      </button>
      <button
        className="px-4 py-2 text-sm font-medium rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-base)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] active:scale-[0.98] transition-all duration-[var(--motion-fast)]"
        onClick={() =>
          addToast({
            title: 'Changes saved',
            description: 'Your profile changes have been saved successfully.',
            variant: 'success',
            action: { label: 'View Changes', onClick: () => {} },
          })
        }>
        Show success toast
      </button>
      <button
        className="px-4 py-2 text-sm font-medium rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-base)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] active:scale-[0.98] transition-all duration-[var(--motion-fast)]"
        onClick={() =>
          addToast({
            title: 'Session expiring soon',
            description: 'Your session will expire in 5 minutes. Save your work.',
            variant: 'warning',
            action: { label: 'Stay Logged In', onClick: () => {} },
          })
        }>
        Show warning toast
      </button>
      <button
        className="px-4 py-2 text-sm font-medium rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-base)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] active:scale-[0.98] transition-all duration-[var(--motion-fast)]"
        onClick={() =>
          addToast({
            title: 'Payment failed',
            description: 'Unable to process payment. Please check your card details and try again.',
            variant: 'error',
            action: { label: 'Try Again', onClick: () => {} },
          })
        }>
        Show error toast
      </button>
      <button
        className="px-4 py-2 text-sm font-medium rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-base)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] active:scale-[0.98] transition-all duration-[var(--motion-fast)]"
        onClick={() =>
          addToast({
            title: 'New feature available',
            description: 'Check out our redesigned dashboard with new analytics tools.',
            variant: 'info',
            action: { label: 'Learn More', onClick: () => {} },
          })
        }>
        Show info toast
      </button>
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <div className="p-8">
      <ToastProvider>
        <DefaultDemo />
      </ToastProvider>
    </div>
  ),
}

export const SuccessToast: Story = {
  render: () => (
    <div className="p-8">
      <ToastProvider>
        <div className="flex flex-wrap gap-3">
          <DemoOne
            label="With action"
            title="Changes saved"
            description="Your profile changes have been saved successfully."
            variant="success"
            actionLabel="View Changes"
          />
          <DemoOne
            label="Without action"
            title="Changes saved"
            description="Your profile changes have been saved successfully."
            variant="success"
          />
        </div>
      </ToastProvider>
    </div>
  ),
}

export const WarningToast: Story = {
  render: () => (
    <div className="p-8">
      <ToastProvider>
        <DemoOne
          label="Warning toast"
          title="Session expiring soon"
          description="Your session will expire in 5 minutes."
          variant="warning"
        />
      </ToastProvider>
    </div>
  ),
}

export const ErrorToast: Story = {
  render: () => (
    <div className="p-8">
      <ToastProvider>
        <DemoOne
          label="Error toast"
          title="Payment failed"
          description="Unable to process payment. Please check your card details and try again."
          variant="error"
          actionLabel="Try Again"
        />
      </ToastProvider>
    </div>
  ),
}

export const InfoToast: Story = {
  render: () => (
    <div className="p-8">
      <ToastProvider>
        <DemoOne
          label="Info toast"
          title="New feature available"
          description="Check out our redesigned dashboard with new analytics tools."
          variant="info"
          actionLabel="Learn More"
        />
      </ToastProvider>
    </div>
  ),
}

export const MultipleToasts: Story = {
  render: () => (
    <div className="p-8">
      <ToastProvider>
        <MultiDemo />
      </ToastProvider>
    </div>
  ),
}

export const LongDuration: Story = {
  render: () => (
    <div className="p-8">
      <ToastProvider>
        <LongDemo />
      </ToastProvider>
    </div>
  ),
}

function DemoOne({
  label,
  title,
  description,
  variant,
  actionLabel,
}: {
  label: string
  title: string
  description: string
  variant: 'default' | 'success' | 'warning' | 'error' | 'info'
  actionLabel?: string
}) {
  const { addToast } = useToast()
  return (
    <button
      className="px-4 py-2 text-sm font-medium rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-base)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] active:scale-[0.98] transition-all duration-[var(--motion-fast)]"
      onClick={() =>
        addToast({
          title,
          description,
          variant,
          action: actionLabel ? { label: actionLabel, onClick: () => {} } : undefined,
        })
      }>
      {label}
    </button>
  )
}

function MultiDemo() {
  const { addToast } = useToast()
  return (
    <button
      className="px-4 py-2 text-sm font-medium rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-base)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] active:scale-[0.98] transition-all duration-[var(--motion-fast)]"
      onClick={() => {
        addToast({
          title: 'Order confirmed',
          description: 'Order #ORD-2024-1847 has been placed.',
          variant: 'success',
          action: { label: 'View Order', onClick: () => {} },
        })
        addToast({ title: 'Payment received', description: '$299.00 credited to your account.', variant: 'info' })
        addToast({
          title: 'Shipping label generated',
          description: 'FedEx tracking FX-847-293-1847 added.',
          variant: 'default',
          action: { label: 'Track', onClick: () => {} },
        })
      }}>
      Trigger 3 Toasts
    </button>
  )
}

function LongDemo() {
  const { addToast } = useToast()
  return (
    <button
      className="px-4 py-2 text-sm font-medium rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--surface-base)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] active:scale-[0.98] transition-all duration-[var(--motion-fast)]"
      onClick={() =>
        addToast({
          title: 'Import in progress',
          description: 'Importing 1,247 products. This may take a few minutes.',
          variant: 'info',
          duration: 15000,
        })
      }>
      Show 15s toast
    </button>
  )
}
