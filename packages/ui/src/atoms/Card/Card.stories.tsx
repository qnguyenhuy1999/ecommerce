import type { Meta, StoryObj } from '@storybook/react'

import { ShoppingCart, Heart, Star } from 'lucide-react'
import { Badge } from '../../lib/shadcn/badge'
import { Button } from '../../lib/shadcn/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../lib/shadcn/card'

const meta: Meta<typeof Card> = {
  title: 'atoms/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>Review your order details before checkout</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>$129.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>$9.99</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span>$11.61</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-between font-semibold">
          <span>Total</span>
          <span>$150.60</span>
        </div>
      </CardFooter>
    </Card>
  ),
}

export const ProductCard: Story = {
  render: () => (
    <Card className="w-full max-w-sm" interactive elevation={2}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Wireless Noise-Cancelling Headphones</CardTitle>
            <CardDescription>Premium audio experience</CardDescription>
          </div>
          <Badge variant="info">New</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex aspect-video items-center justify-center rounded-md bg-muted">
          <span className="text-sm text-muted-foreground">Product Image</span>
        </div>
        <div className="mb-3 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="h-4 w-4 fill-warning text-warning" />
          ))}
          <span className="ml-1 text-xs text-muted-foreground">(248 reviews)</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold">$299.00</span>
            <span className="ml-2 text-sm text-muted-foreground line-through">$399.00</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-2">
          <Button variant="brand" className="flex-1" icon={<ShoppingCart className="h-4 w-4" />}>
            Add to Cart
          </Button>
          <div aria-label="Wishlist">
            <Button variant="outline" size="icon" icon={<Heart className="h-4 w-4" />} />
          </div>
        </div>
      </CardFooter>
    </Card>
  ),
}

export const ElevationLevels: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      {([0, 1, 2, 3] as const).map((level) => (
        <Card key={level} elevation={level} className="w-40">
          <CardHeader>
            <CardTitle className="text-sm">Elevation {level}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Shadow level {level}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
}

export const Interactive: Story = {
  render: () => (
    <Card className="w-full max-w-md" interactive>
      <CardHeader>
        <CardTitle>Hover to see interaction</CardTitle>
        <CardDescription>This card lifts on hover</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Try hovering over this card to see the interactive elevation effect with a subtle translate animation.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          Learn More
        </Button>
      </CardFooter>
    </Card>
  ),
}
