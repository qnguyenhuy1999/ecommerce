import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { Users } from './Users'
import { usersDefaultProps } from './Users.fixtures'

const meta = {
  title: 'Pages/Users',
  component: Users,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Users>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...usersDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <Users {...args} />
    </ConsoleLayout>
  ),
}
