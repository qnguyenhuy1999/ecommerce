import type { Meta, StoryObj } from '@storybook/react-vite'
import { Approvals } from './Approvals'
import { mockApprovals } from './Approvals.fixtures'

const meta = {
  title: 'Pages/Approvals',
  component: Approvals,
} satisfies Meta<typeof Approvals>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithData: Story = {
  args: { approvals: mockApprovals } as never,
}
