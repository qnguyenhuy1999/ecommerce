import type { Meta, StoryObj } from '@storybook/react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './index'
import { Badge } from '../../atoms/badge'

const meta: Meta<typeof Tabs> = {
  title: 'molecules/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="specs">Specs</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="space-y-3 pt-2">
          <p className="text-sm text-muted-foreground">
            Premium over-ear headphones with active noise cancellation, 30-hour battery life, and multipoint Bluetooth
            for two devices simultaneously.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="success">30h Battery</Badge>
            <Badge variant="info">ANC</Badge>
            <Badge variant="soft">Multipoint</Badge>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="specs">
        <div className="space-y-2 pt-2">
          {[
            { label: 'Driver Size', value: '40mm' },
            { label: 'Frequency Response', value: '20Hz – 40kHz' },
            { label: 'Impedance', value: '32 ohms' },
            { label: 'Weight', value: '250g' },
            { label: 'Bluetooth', value: '5.2' },
            { label: 'Battery Life', value: '30 hours' },
          ].map((spec) => (
            <div key={spec.label} className="flex justify-between py-2 border-b border-border text-sm last:border-0">
              <span className="text-muted-foreground">{spec.label}</span>
              <span className="font-medium">{spec.value}</span>
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="reviews">
        <div className="space-y-4 pt-2">
          {[
            {
              name: 'Marcus J.',
              rating: 5,
              text: "Best headphones I've ever owned. The noise cancellation is incredible on flights.",
            },
            {
              name: 'Sofia R.',
              rating: 4,
              text: 'Great sound quality. Battery lasts longer than advertised. Slightly tight fit after 4 hours.',
            },
            {
              name: 'Priya S.',
              rating: 5,
              text: 'Worth every penny. The multipoint connection is a game-changer for working from home.',
            },
          ].map((review, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{review.name}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, s) => (
                    <span key={s} className={`h-3 w-3 rounded-full ${s < review.rating ? 'bg-warning' : 'bg-muted'}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{review.text}</p>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  ),
}

export const ProductPage: Story = {
  render: () => (
    <Tabs defaultValue="description" className="w-full max-w-lg">
      <TabsList className="w-full">
        <TabsTrigger value="description" className="flex-1">
          Description
        </TabsTrigger>
        <TabsTrigger value="shipping" className="flex-1">
          Shipping
        </TabsTrigger>
        <TabsTrigger value="returns" className="flex-1">
          Returns
        </TabsTrigger>
        <TabsTrigger value="faq" className="flex-1">
          FAQ
        </TabsTrigger>
      </TabsList>
      <TabsContent value="description">
        <p className="text-sm text-muted-foreground pt-3">
          Premium over-ear headphones engineered for audiophiles and professionals. Active noise cancellation with four
          microphones adapts to your environment in real time. 30-hour battery with USB-C fast charge (10 min = 3 hours
          playback).
        </p>
      </TabsContent>
      <TabsContent value="shipping">
        <div className="space-y-2 pt-3">
          {[
            { method: 'Standard (3–5 days)', cost: 'Free' },
            { method: 'Express (1–2 days)', cost: '$12.99' },
            { method: 'Overnight', cost: '$24.99' },
          ].map((s) => (
            <div key={s.method} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
              <span>{s.method}</span>
              <span className="font-medium">{s.cost}</span>
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="returns">
        <p className="text-sm text-muted-foreground pt-3">
          We offer free returns within 30 days. Items must be in original packaging with all accessories. Initiate a
          return from your orders dashboard or contact support.
        </p>
      </TabsContent>
      <TabsContent value="faq">
        <div className="space-y-3 pt-3 text-sm">
          <div>
            <p className="font-medium">Can I connect to two devices at once?</p>
            <p className="text-muted-foreground">Yes — multipoint Bluetooth allows two simultaneous connections.</p>
          </div>
          <div>
            <p className="font-medium">Is a carrying case included?</p>
            <p className="text-muted-foreground">Yes, a premium hard-shell case is included.</p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  ),
}

export const SettingsTabs: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-full max-w-md">
      <TabsList className="w-full">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="flex flex-col gap-3 pt-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Full Name</label>
            <div className="h-9 rounded border border-input bg-transparent px-3 py-2 text-sm">Sarah Chen</div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <div className="h-9 rounded border border-input bg-transparent px-3 py-2 text-sm">sarah@example.com</div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="notifications">
        <div className="flex flex-col gap-3 pt-3">
          {[
            { label: 'Order updates', desc: 'Shipping and delivery notifications' },
            { label: 'Promotions', desc: 'Deals, sales, and special offers' },
            { label: 'Product alerts', desc: 'Back-in-stock and price drop alerts' },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{n.label}</p>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
              </div>
              <div className="h-5 w-9 rounded-full bg-brand" />
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="security">
        <div className="flex flex-col gap-3 pt-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span>Password</span>
            <span className="text-brand">Change</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span>Two-Factor Authentication</span>
            <span className="text-brand">Enable</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span>Active sessions</span>
            <span className="text-muted-foreground">2 devices</span>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  ),
}
