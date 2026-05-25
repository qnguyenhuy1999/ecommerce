import type { Meta, StoryObj } from '@storybook/react-vite'
import { Warehouses } from './Warehouses'

const meta = {
  title: 'Pages/Warehouses',
  component: Warehouses,
} satisfies Meta<typeof Warehouses>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
