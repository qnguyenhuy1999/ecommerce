import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './index'

const meta: Meta<typeof Select> = {
  title: 'atoms/Select',
  component: Select,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Electronics</SelectLabel>
          <SelectItem value="headphones">Headphones</SelectItem>
          <SelectItem value="keyboards">Keyboards</SelectItem>
          <SelectItem value="mice">Mice & Trackpads</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Accessories</SelectLabel>
          <SelectItem value="cables">Cables & Adapters</SelectItem>
          <SelectItem value="stands">Stands & Mounts</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const WithValue: Story = {
  render: () => (
    <Select defaultValue="headphones">
      <SelectTrigger className="w-64">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="headphones">Headphones</SelectItem>
        <SelectItem value="keyboards">Keyboards</SelectItem>
        <SelectItem value="monitors">Monitors</SelectItem>
        <SelectItem value="webcams">Webcams</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const Controlled: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = React.useState('')
    return (
      <div className="flex flex-col gap-4">
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Choose a shipping method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard — Free</SelectItem>
            <SelectItem value="express">Express — $12.99</SelectItem>
            <SelectItem value="overnight">Overnight — $29.99</SelectItem>
          </SelectContent>
        </Select>
        {value && <p className="text-sm text-muted-foreground">Selected: {value}</p>}
      </div>
    )
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-sm">
      <Select defaultValue="default">
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Small" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Small Size</SelectItem>
          <SelectItem value="medium">Medium Size</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="default">
        <SelectTrigger>
          <SelectValue placeholder="Default" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default Size</SelectItem>
          <SelectItem value="medium">Medium Size</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const ProductSort: Story = {
  render: () => (
    <Select defaultValue="featured">
      <SelectTrigger className="w-56">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort By</SelectLabel>
          <SelectItem value="featured">Featured</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="rating">Highest Rated</SelectItem>
          <SelectItem value="newest">Newest Arrivals</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}
