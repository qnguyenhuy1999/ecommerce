import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bulk } from './Bulk'

const meta = {
  title: 'Pages/Bulk',
  component: Bulk,
} satisfies Meta<typeof Bulk>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
