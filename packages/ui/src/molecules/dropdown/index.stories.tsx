import type { Meta, StoryObj } from '@storybook/react'
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from './index'
import { Button } from '@/atoms/button'

const meta: Meta<typeof Dropdown> = {
  title: 'molecules/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Dropdown>

export const Default: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant="outline">Open Dropdown</Button>
      </DropdownTrigger>
      <DropdownContent>
        <DropdownItem>Edit Product</DropdownItem>
        <DropdownItem>Duplicate</DropdownItem>
        <DropdownItem>Move to Category</DropdownItem>
      </DropdownContent>
    </Dropdown>
  ),
}

export const EcommerceActions: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant="outline" size="sm">
          Product Actions
        </Button>
      </DropdownTrigger>
      <DropdownContent>
        <DropdownItem>View Details</DropdownItem>
        <DropdownItem>Edit Product</DropdownItem>
        <DropdownItem>Duplicate Listing</DropdownItem>
        <DropdownItem>Move to Category</DropdownItem>
        <DropdownItem>Archive Product</DropdownItem>
        <DropdownItem>Delete</DropdownItem>
      </DropdownContent>
    </Dropdown>
  ),
}

export const UserMenu: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant="ghost" size="sm">
          User Menu
        </Button>
      </DropdownTrigger>
      <DropdownContent>
        <DropdownItem>My Profile</DropdownItem>
        <DropdownItem>Order History</DropdownItem>
        <DropdownItem>Wishlist</DropdownItem>
        <DropdownItem>Settings</DropdownItem>
        <DropdownItem>Sign Out</DropdownItem>
      </DropdownContent>
    </Dropdown>
  ),
}

export const SettingsMenu: Story = {
  render: () => (
    <div className="flex gap-3 flex-wrap">
      <Dropdown>
        <DropdownTrigger asChild>
          <Button variant="outline" size="sm">
            Sort By
          </Button>
        </DropdownTrigger>
        <DropdownContent>
          <DropdownItem>Featured</DropdownItem>
          <DropdownItem>Price: Low to High</DropdownItem>
          <DropdownItem>Price: High to Low</DropdownItem>
          <DropdownItem>Highest Rated</DropdownItem>
          <DropdownItem>Newest Arrivals</DropdownItem>
        </DropdownContent>
      </Dropdown>
      <Dropdown>
        <DropdownTrigger asChild>
          <Button variant="outline" size="sm">
            View
          </Button>
        </DropdownTrigger>
        <DropdownContent>
          <DropdownItem>Grid View</DropdownItem>
          <DropdownItem>List View</DropdownItem>
          <DropdownItem>Compact View</DropdownItem>
        </DropdownContent>
      </Dropdown>
    </div>
  ),
}
