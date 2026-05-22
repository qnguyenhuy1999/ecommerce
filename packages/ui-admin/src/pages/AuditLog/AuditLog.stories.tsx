import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { AuditLog } from './AuditLog'
import { auditLogDefaultProps } from './AuditLog.fixtures'

const meta = {
  title: 'Pages/AuditLog',
  component: AuditLog,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AuditLog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...auditLogDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <AuditLog {...args} />
    </ConsoleLayout>
  ),
}
