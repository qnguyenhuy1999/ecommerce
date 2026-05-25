import type { Meta, StoryObj } from '@storybook/react-vite'
import { AuthPageShell } from './AuthPageShell'

const meta = {
  title: 'Layouts/AuthPageShell',
  component: AuthPageShell,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    title: 'Sign In',
    children: undefined,
  },
} satisfies Meta<typeof AuthPageShell>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <AuthPageShell title="Sign In">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="admin@halo.market"
            className="border-input bg-background w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="border-input bg-background w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <button className="bg-primary text-primary-foreground w-full rounded-lg py-2 text-sm font-medium">
          Sign in
        </button>
      </div>
    </AuthPageShell>
  ),
}

export const ForgotPassword: Story = {
  render: () => (
    <AuthPageShell title="Reset Password">
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">Enter your email to receive a password reset link.</p>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="admin@halo.market"
            className="border-input bg-background w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <button className="bg-primary text-primary-foreground w-full rounded-lg py-2 text-sm font-medium">
          Send reset link
        </button>
      </div>
    </AuthPageShell>
  ),
}
