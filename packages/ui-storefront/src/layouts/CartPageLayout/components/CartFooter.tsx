import React from 'react'

import { cn } from '@ecom/ui'

export interface CartFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  continueShoppingHref?: string
}

const PAYMENT_METHODS = ['VISA', 'MC', 'AMEX', 'PayPal'] as const

export function CartFooter({
  continueShoppingHref = '/shop',
  className,
  ...props
}: CartFooterProps) {
  return (
    <footer
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
      {...props}
    >
      <a
        href={continueShoppingHref}
        className="text-sm font-medium text-[var(--action-primary)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)]"
      >
        Continue Shopping
      </a>

      <ul className="flex flex-wrap items-center gap-2" aria-label="Accepted payment methods">
        {PAYMENT_METHODS.map((method) => (
          <li
            key={method}
            className="rounded border border-[var(--border-default)] px-2 py-1 text-xs font-semibold text-[var(--text-secondary)]"
          >
            {method}
          </li>
        ))}
      </ul>
    </footer>
  )
}
