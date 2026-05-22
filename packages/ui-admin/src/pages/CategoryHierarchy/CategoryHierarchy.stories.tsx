import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { CategoryHierarchy } from './CategoryHierarchy'
import { categoryHierarchyDefaultProps } from './CategoryHierarchy.fixtures'

const meta = {
  title: 'Pages/CategoryHierarchy',
  component: CategoryHierarchy,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CategoryHierarchy>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...categoryHierarchyDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <CategoryHierarchy {...args} />
    </ConsoleLayout>
  ),
}
