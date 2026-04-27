import { useMemo } from 'react'

import { Package } from 'lucide-react'

import { EmptyState } from '@ecom/ui'

import { EmptyStateCard } from '../shared/EmptyStateCard'
import { AccountOrderLayoutProps } from './AccountOrderLayout'

export const AccountOrderLayoutHeader = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
        Order history
      </h1>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Check the status of recent orders, manage returns, and discover similar products.
      </p>
    </div>
  )
}

export const AccountOrderLayoutEmptyState = ({
  emptyState,
  isFiltered,
  onStartShopping,
}: Pick<AccountOrderLayoutProps, 'emptyState' | 'onStartShopping'> & { isFiltered: boolean }) => {
  const text = useMemo(
    () => ({
      title: isFiltered ? 'No orders match these filters' : 'No orders yet',
      description: isFiltered
        ? 'Try a broader date range or clear the search to see more orders.'
        : "Looks like you haven't placed an order yet. When you do, it will show up here.",
      action:
        isFiltered || !onStartShopping
          ? undefined
          : {
              label: 'Start shopping',
              onClick: onStartShopping,
            },
    }),
    [isFiltered, onStartShopping],
  )

  return (
    <div className="mt-4">
      <EmptyStateCard>
        {emptyState ?? (
          <EmptyState
            icon={<Package className="h-12 w-12 text-[var(--text-tertiary)]" aria-hidden="true" />}
            title={text.title}
            description={text.description}
            action={text.action}
          />
        )}
      </EmptyStateCard>
    </div>
  )
}
