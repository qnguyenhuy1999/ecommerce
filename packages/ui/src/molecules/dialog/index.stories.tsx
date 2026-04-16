import type { Meta, StoryObj } from '@storybook/react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from './index'
import { Button } from '@/atoms/button'
import { Input } from '@/atoms/input'
import { Label } from '@/atoms/label'

const meta: Meta<typeof Dialog> = {
  title: 'molecules/Dialog',
  component: Dialog,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            Are you sure you want to proceed with this action? This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const AddToCart: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="brand">Add to Cart</Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Added to Cart</DialogTitle>
          <DialogDescription>Premium Wireless Headphones Pro has been added to your cart.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-2">
          <div className="flex items-center gap-3 p-3 border rounded-[var(--radius-sm)]">
            <div className="h-14 w-14 bg-muted rounded shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Premium Wireless Headphones Pro</p>
              <p className="text-sm text-muted-foreground">$249.99</p>
            </div>
          </div>
          <div className="flex justify-between text-sm border-t pt-3">
            <span className="text-muted-foreground">Cart total (2 items)</span>
            <span className="font-semibold">$489.97</span>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Continue Shopping</Button>
          </DialogClose>
          <Button variant="brand">Checkout</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const DeleteConfirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Product</Button>
      </DialogTrigger>
      <DialogContent variant="destructive">
        <DialogHeader>
          <DialogTitle>Delete Product?</DialogTitle>
          <DialogDescription>
            This will permanently delete <strong>Premium Wireless Headphones Pro</strong> and all associated images and
            data. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive">Yes, Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const InputDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Category</Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>Add a new product category to your catalog.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cat-name">Category Name</Label>
            <Input id="cat-name" placeholder="e.g. Wireless Audio" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cat-slug">Slug</Label>
            <Input id="cat-slug" placeholder="wireless-audio" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="brand">Create Category</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const Large: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Large Dialog</Button>
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>Full details for order #ORD-2024-3847</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Customer:</span> <span className="font-medium">Sarah Chen</span>
            </div>
            <div>
              <span className="text-muted-foreground">Date:</span> <span className="font-medium">March 15, 2024</span>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span> <span className="font-medium">Shipped</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total:</span> <span className="font-medium">$349.97</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t pt-3">
            <p className="text-sm font-medium">Items</p>
            {['Premium Headphones Pro × 1', 'USB-C Hub 7-in-1 × 2'].map((item) => (
              <div key={item} className="flex justify-between text-sm py-1">
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
