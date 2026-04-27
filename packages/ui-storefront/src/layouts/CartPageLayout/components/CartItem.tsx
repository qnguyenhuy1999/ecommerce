'use client'

import React from 'react'

import { ImageOff, Trash2 } from 'lucide-react'

import { IconButton } from '@ecom/ui'
import { cn } from '@ecom/ui/utils'

import { clampQuantity } from '../utils/cartPricing'
import { PriceDisplay, QuantityStepper } from '../../../atoms'

export interface CartItemProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string
  imageSrc?: string
  title: string
  variant?: string
  originalPrice?: number
  finalPrice: number
  quantity: number
  onQuantityChange: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export function CartItem({
  id,
  imageSrc,
  title,
  variant,
  originalPrice,
  finalPrice,
  quantity,
  onQuantityChange,
  onRemove,
  className,
  ...props
}: CartItemProps) {
  function updateQuantity(nextQuantity: number) {
    onQuantityChange(id, clampQuantity(nextQuantity, 1, 99))
  }

  return (
    <article
      className={cn(
        'rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-4 shadow-[var(--elevation-card)]',
        className,
      )}
      {...props}
    >
      <div className="flex gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-[var(--surface-muted)]">
          {imageSrc ? (
            <img src={imageSrc} alt={title} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[var(--text-tertiary)]">
              <ImageOff className="h-5 w-5" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold leading-5 text-[var(--text-primary)]">
                {title}
              </h3>
              {variant && <p className="text-xs text-[var(--text-secondary)]">{variant}</p>}
            </div>

            <IconButton
              icon={<Trash2 className="h-4 w-4 text-[var(--intent-danger)]" />}
              label={`Remove ${title} from cart`}
              onClick={() => onRemove(id)}
            />
          </div>

          <div className="flex items-center gap-2">
            <PriceDisplay price={finalPrice} originalPrice={originalPrice} size="sm" />
          </div>

          <QuantityStepper
            value={quantity}
            onChange={(newQuantity) => updateQuantity(newQuantity)}
            min={1}
            max={99}
            size="sm"
          />
        </div>
      </div>
    </article>
  )
}
