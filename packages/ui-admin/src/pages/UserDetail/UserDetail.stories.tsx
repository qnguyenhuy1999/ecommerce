import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { UserDetail } from './UserDetail'
import { userDetailDefaultProps } from './UserDetail.fixtures'

const meta = {
  title: 'Pages/UserDetail',
  component: UserDetail,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof UserDetail>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...userDetailDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <UserDetail {...args} />
    </ConsoleLayout>
  ),
}

export const Loading: Story = {
  args: {
    loading: true,
  },
  render: (args) => (
    <ConsoleLayout>
      <UserDetail {...args} />
    </ConsoleLayout>
  ),
}

export const NotFound: Story = {
  args: {
    loading: false,
  },
  render: (args) => (
    <ConsoleLayout>
      <UserDetail {...args} />
    </ConsoleLayout>
  ),
}
