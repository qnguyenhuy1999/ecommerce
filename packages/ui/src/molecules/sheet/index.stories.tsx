import type { Meta, StoryObj } from '@storybook/react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from './index'
import { Button } from '@/atoms/button'
import { Badge } from '@/atoms/badge'
import { Checkbox } from '@/atoms/checkbox'

const meta: Meta<typeof Sheet> = {
  title: 'molecules/Sheet',
  component: Sheet,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Sheet>

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>This is a sheet panel from the right side.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4">
          <p className="text-sm text-muted-foreground">Sheet content goes here.</p>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button variant="brand">Confirm</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const CartSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          View Cart <Badge size="sm">3</Badge>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>3 items in your cart</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 py-4">
          {[
            { name: 'Premium Wireless Headphones', price: '$249.99', qty: 1 },
            { name: 'USB-C Hub 7-in-1', price: '$49.99', qty: 2 },
          ].map(({ name, price, qty }) => (
            <div key={name} className="flex items-center gap-3 p-3 border rounded-[var(--radius-sm)]">
              <div className="h-12 w-12 bg-muted rounded shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{name}</p>
                <p className="text-xs text-muted-foreground">
                  {qty}× {price}
                </p>
              </div>
            </div>
          ))}
        </div>
        <SheetFooter>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span>$349.97</span>
            </div>
            <SheetClose asChild>
              <Button variant="brand" className="w-full">
                Checkout
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full">
                Continue Shopping
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const FiltersSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Filters</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
          <SheetDescription>Narrow down your product selection</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold">Category</h4>
            {['Headphones', 'Keyboards', 'Mice & Trackpads', 'Monitors', 'Accessories'].map((cat) => (
              <div key={cat} className="flex items-center gap-3">
                <Checkbox id={`filter-${cat}`} />
                <label htmlFor={`filter-${cat}`} className="text-sm cursor-pointer">
                  {cat}
                </label>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold">Price Range</h4>
            <div className="flex gap-2">
              <input type="number" placeholder="Min" className="w-full border rounded px-3 py-1.5 text-sm" />
              <input type="number" placeholder="Max" className="w-full border rounded px-3 py-1.5 text-sm" />
            </div>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Clear All</Button>
          </SheetClose>
          <Button variant="brand">Apply Filters</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const SettingsSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Account Settings</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Account Settings</SheetTitle>
          <SheetDescription>Manage your account preferences</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4">
          {['Profile Information', 'Notification Preferences', 'Security', 'Billing', 'Connected Apps'].map(
            (section) => (
              <div key={section} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <span className="text-sm font-medium">{section}</span>
                <span className="text-xs text-muted-foreground">Manage →</span>
              </div>
            ),
          )}
        </div>
      </SheetContent>
    </Sheet>
  ),
}
