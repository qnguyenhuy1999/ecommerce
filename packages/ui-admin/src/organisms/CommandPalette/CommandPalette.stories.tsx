import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'

import { Settings, User, Package, ShoppingCart, BarChart3, Tag, Globe } from 'lucide-react'

import { Button } from '@ecom/ui'

import { CommandPalette, type CommandGroup } from './CommandPalette'

const meta: Meta<typeof CommandPalette> = {
  title: 'organisms/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CommandPalette>

const NAVIGATION_GROUP: CommandGroup = {
  heading: 'Navigation',
  items: [
    { id: 'nav-dashboard', label: 'Go to Dashboard', icon: <BarChart3 />, shortcut: 'G D', onSelect: () => {} },
    { id: 'nav-orders', label: 'Go to Orders', icon: <ShoppingCart />, shortcut: 'G O', onSelect: () => {} },
    { id: 'nav-products', label: 'Go to Products', icon: <Package />, shortcut: 'G P', onSelect: () => {} },
    { id: 'nav-customers', label: 'Go to Customers', icon: <User />, shortcut: 'G C', onSelect: () => {} },
  ],
}

const ACTIONS_GROUP: CommandGroup = {
  heading: 'Actions',
  items: [
    { id: 'act-new-order', label: 'Create New Order', icon: <ShoppingCart />, shortcut: 'N', onSelect: () => {} },
    { id: 'act-new-product', label: 'Add New Product', icon: <Package />, shortcut: 'P', onSelect: () => {} },
    { id: 'act-new-customer', label: 'Add New Customer', icon: <User />, onSelect: () => {} },
  ],
}

const PAGES_GROUP: CommandGroup = {
  heading: 'Pages',
  items: [
    { id: 'page-analytics', label: 'Analytics', icon: <BarChart3 />, onSelect: () => {} },
    { id: 'page-discounts', label: 'Discounts & Promotions', icon: <Tag />, onSelect: () => {} },
    { id: 'page-settings', label: 'Settings', icon: <Settings />, onSelect: () => {} },
    { id: 'page-seo', label: 'SEO & Metadata', icon: <Globe />, onSelect: () => {} },
  ],
}

const ALL_GROUPS: CommandGroup[] = [NAVIGATION_GROUP, ACTIONS_GROUP, PAGES_GROUP]

function DefaultPalette() {
  const [open, setOpen] = useState(false)
  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
      <CommandPalette open={open} onOpenChange={setOpen} groups={ALL_GROUPS} />
    </div>
  )
}

function SearchFilterPalette() {
  const [open, setOpen] = useState(false)
  return (
    <div className="p-8 space-y-4">
      <p className="text-sm text-muted-foreground">Click the button, then type "order" to filter commands.</p>
      <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
      <CommandPalette open={open} onOpenChange={setOpen} groups={ALL_GROUPS} />
    </div>
  )
}

function NavigationOnlyPalette() {
  const [open, setOpen] = useState(false)
  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
      <CommandPalette open={open} onOpenChange={setOpen} groups={[NAVIGATION_GROUP]} />
    </div>
  )
}

export const Default: Story = {
  render: () => <DefaultPalette />,
}

export const WithSearchFilter: Story = {
  render: () => <SearchFilterPalette />,
}

export const NavigationOnly: Story = {
  render: () => <NavigationOnlyPalette />,
}
