import type { Meta, StoryObj } from '@storybook/react-vite'
import { Home } from './Home'

const meta: Meta<typeof Home> = {
  title: 'pages/Home',
  component: Home,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta

type Story = StoryObj<typeof Home>

export const MarketplaceHome: Story = {}
