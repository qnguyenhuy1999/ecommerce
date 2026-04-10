import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../button/index'
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from './index'

const meta = {
  title: 'Molecules/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  render: () => (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant="outline">Open Menu</Button>
      </DropdownTrigger>
      <DropdownContent>
        <DropdownItem>Profile</DropdownItem>
        <DropdownItem>Billing</DropdownItem>
        <DropdownItem>Settings</DropdownItem>
        <DropdownItem>Sign out</DropdownItem>
      </DropdownContent>
    </Dropdown>
  ),
}

export const WithDividers = {
  render: () => (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant="outline">Options</Button>
      </DropdownTrigger>
      <DropdownContent>
        <DropdownItem>New file</DropdownItem>
        <DropdownItem>Open folder</DropdownItem>
        <DropdownItem>Save</DropdownItem>
        <DropdownItem>Save as...</DropdownItem>
      </DropdownContent>
    </Dropdown>
  ),
}
