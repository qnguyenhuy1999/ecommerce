'use client'

import React from 'react'

import { Button, cn } from '@ecom/ui'

import { CartItem } from './CartItem'
import type { CartItemProps } from './CartItem'

export type CartListItem = Omit<CartItemProps, 'onQuantityChange' | 'onRemove'>

export interface CartListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: CartListItem[]
  onItemQuantityChange: (id: string, quantity: number) => void
  onItemRemove: (id: string) => void
  onRemoveAll: () => void
}

export function CartList({
  items,
  onItemQuantityChange,
  onItemRemove,
  onRemoveAll,
  className,
  ...props
}: CartListProps) {
  function handleRemoveAll() {
    if (items.length === 0) {
      return
    }

    if (typeof window !== 'undefined') {
      const confirmed = window.confirm('Are you sure you want to remove all items from your cart?')
      if (!confirmed) {
        return
      }
    }

    onRemoveAll()
  }

  return (
    <section className={cn('space-y-4', className)} aria-label="Cart items" {...props}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h2>
        <Button variant="link" size="sm" onClick={handleRemoveAll} className="text-xs font-medium">
          Remove all
        </Button>
      </div>

      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item) => (
            <CartItem
              key={item.id}
              {...item}
              onQuantityChange={onItemQuantityChange}
              onRemove={onItemRemove}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-[var(--radius-md)] border border-dashed border-[var(--border-subtle)] p-6 text-center text-sm text-[var(--text-secondary)]">
          Your cart is currently empty.
        </p>
      )}
    </section>
  )
}
