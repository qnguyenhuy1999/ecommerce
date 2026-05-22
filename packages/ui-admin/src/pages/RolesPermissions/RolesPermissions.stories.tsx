import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { RolesPermissions } from './RolesPermissions'
import { rolesPermissionsDefaultProps } from './RolesPermissions.fixtures'

const meta = {
  title: 'Pages/RolesPermissions',
  component: RolesPermissions,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof RolesPermissions>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...rolesPermissionsDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <RolesPermissions {...args} />
    </ConsoleLayout>
  ),
}
