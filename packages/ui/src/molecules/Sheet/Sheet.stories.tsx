import type { Meta, StoryObj } from '@storybook/react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from './Sheet'
import { Button } from '../../atoms/Button/Button'
import { Badge } from '../../atoms/Badge/Badge'
import { Checkbox } from '../../atoms/Checkbox/Checkbox'

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <line x1="3" x2="21" y1="6" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          View Cart <Badge size="sm">3</Badge>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col overflow-hidden [&>button]:hidden p-0">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-[var(--radius-md)] bg-[var(--action-muted)] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--brand-500)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <line x1="3" x2="21" y1="6" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <div>
              <SheetTitle className="text-left text-base leading-tight">Shopping Cart</SheetTitle>
              <SheetDescription className="text-left text-xs mt-0.5">
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--success-500)]" />3 items — ready to
                  checkout
                </span>
              </SheetDescription>
            </div>
          </div>
          <SheetClose asChild>
            <button
              className="h-8 w-8 shrink-0 flex items-center justify-center rounded-[var(--radius-xs)] border border-border hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Close cart">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </SheetClose>
        </div>

        {/* ── Free shipping banner ── */}
        <div className="mx-6 mt-4 px-3.5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--intent-success-muted)] border border-[var(--intent-success)]/20">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--intent-success)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-xs font-medium text-[var(--intent-success)]">You have free shipping on this order!</span>
          </div>
          <div className="mt-2 h-1 rounded-full bg-[var(--intent-success)]/15 overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-[var(--intent-success)] transition-all" />
          </div>
        </div>

        {/* ── Cart Items ── */}
        <div className="flex-1 overflow-y-auto py-4 px-6">
          <div className="flex flex-col gap-3">
            {[
              {
                name: 'Premium Wireless Headphones',
                variant: 'Midnight Black — In stock',
                unitPrice: 249.99,
                qty: 1,
                gradientFrom: 'var(--gray-800)',
                gradientTo: 'var(--gray-900)',
                label: '🎧',
              },
              {
                name: 'USB-C Hub 7-in-1',
                variant: 'Space Gray — Ships in 2 days',
                unitPrice: 49.99,
                qty: 2,
                gradientFrom: 'var(--gray-600)',
                gradientTo: 'var(--gray-700)',
                label: '🔌',
              },
              {
                name: 'Wireless Charging Pad',
                variant: 'White — In stock',
                unitPrice: 29.99,
                qty: 1,
                gradientFrom: 'var(--gray-200)',
                gradientTo: 'var(--gray-300)',
                label: '⚡',
              },
            ].map(({ name, variant, unitPrice, qty, gradientFrom, gradientTo, label }) => (
              <div
                key={name}
                className="group relative flex gap-4 p-3.5 rounded-[var(--radius-md)] border border-border bg-[var(--color-background)] hover:border-[var(--brand-500)]/20 hover:shadow-[var(--shadow-sm)] transition-all duration-[var(--motion-fast)] cursor-pointer">
                {/* Product image placeholder */}
                <div
                  className="w-[68px] h-[68px] shrink-0 rounded-[var(--radius-sm)] flex items-center justify-center text-2xl"
                  style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
                >
                  <span className="opacity-80">{label}</span>
                </div>

                {/* Product info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground leading-tight">{name}</p>
                    <p className="text-micro text-muted-foreground mt-0.5">{variant}</p>
                  </div>

                  <div className="flex items-end justify-between mt-2">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-1 rounded-[var(--radius-xs)] border border-[var(--border-default)]/60 bg-[var(--color-background)] overflow-hidden">
                      <button
                        type="button"
                        className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        aria-label="Decrease">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                      <span className="w-6 text-center text-xs font-semibold tabular-nums">{qty}</span>
                      <button
                        type="button"
                        className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        aria-label="Increase">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>

                    <p className="text-sm font-semibold tabular-nums">${(unitPrice * qty).toFixed(2)}</p>
                  </div>
                </div>

                {/* Remove */}
                <button
                  type="button"
                  className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 bg-destructive/10 hover:bg-destructive/20 text-destructive transition-all duration-[var(--motion-fast)]"
                  aria-label="Remove item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer: summary + actions ── */}
        <div className="border-t border-border px-6 py-5 space-y-4 bg-[var(--surface-muted)]/30">
          {/* Line items */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Subtotal</span>
              <span className="font-medium tabular-nums">$379.96</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Shipping</span>
              <span className="font-medium text-[var(--intent-success)]">Free</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Estimated tax</span>
              <span className="font-medium tabular-nums text-[var(--text-secondary)]">$30.40</span>
            </div>
          </div>

          <div className="h-px bg-[var(--border-default)]/60" />

          {/* Total */}
          <div className="flex justify-between items-baseline">
            <div>
              <span className="text-sm font-semibold text-[var(--text-primary)]">Total</span>
              <span className="ml-2 text-xs text-[var(--text-secondary)]">(inc. tax)</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-[var(--text-secondary)]">USD</span>
              <span className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">$410.36</span>
            </div>
          </div>

          {/* CTA */}
          <SheetClose asChild>
            <Button variant="brand" size="lg" className="w-full font-bold text-sm tracking-wide">
              Proceed to Checkout
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <button className="w-full text-center text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-1">
              Continue Shopping
            </button>
          </SheetClose>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-4 pt-1 text-[var(--text-secondary)]">
            <span className="text-[var(--text-micro)] flex items-center gap-1 font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              Secure
            </span>
            <span className="text-[var(--text-micro)] flex items-center gap-1 font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Free returns
            </span>
            <span className="text-[var(--text-micro)] flex items-center gap-1 font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
              30-day guarantee
            </span>
          </div>
        </div>
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
