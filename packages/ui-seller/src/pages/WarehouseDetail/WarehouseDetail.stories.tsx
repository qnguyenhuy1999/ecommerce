import type { Meta, StoryObj } from '@storybook/react-vite'
import { WarehouseDetail } from './WarehouseDetail'

const meta = {
  title: 'Pages/WarehouseDetail',
  component: WarehouseDetail,
} satisfies Meta<typeof WarehouseDetail>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
