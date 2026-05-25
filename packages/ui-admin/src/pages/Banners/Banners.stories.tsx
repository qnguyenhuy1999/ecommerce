import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { Banners } from './Banners'
import { bannersDefaultProps } from './Banners.fixtures'

const meta = {
  title: 'Pages/Banners',
  component: Banners,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Banners>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...bannersDefaultProps,
  },
  render: (args) => (
    <ConsoleLayout>
      <Banners {...args} />
    </ConsoleLayout>
  ),
}

export const Empty: Story = {
  args: {
    ...bannersDefaultProps,
    items: [],
  },
  render: (args) => (
    <ConsoleLayout>
      <Banners {...args} />
    </ConsoleLayout>
  ),
}
