import type { Meta } from '@storybook/react'

import { Button } from '@ecom/ui'

import { Header, HeaderUserMenu } from './index'
import type { HeaderProps } from './types'

const meta = {
  title: 'Organisms/AdminHeader',
  component: Header,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Header>

export default meta

export const Default = {
  args: {
    title: 'Dashboard',
    subtitle: 'Welcome back, Admin',
  } as HeaderProps,
}

export const WithActions = {
  args: {
    title: 'Products',
    subtitle: 'Manage your product catalog',
    actions: (
      <>
        <Button size="sm">Add Product</Button>
        <Button size="sm" variant="outline">
          Export
        </Button>
      </>
    ),
  } as HeaderProps,
}

export const TitleOnly = {
  args: {
    title: 'Analytics',
  } as HeaderProps,
}

export const HeaderUserMenuDefault = {
  render: () => <HeaderUserMenu userName="Jane Admin" userEmail="jane@example.com" />,
}

export const HeaderUserMenuAnonymous = {
  render: () => <HeaderUserMenu />,
}
