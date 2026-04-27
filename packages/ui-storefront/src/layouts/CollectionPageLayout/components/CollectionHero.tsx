import type React from 'react'

import { cn } from '@ecom/ui/utils'

export interface CollectionHeroProps {
  breadcrumb?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  resultsLabel?: string
  heroAccent?: React.ReactNode
  headerExtras?: React.ReactNode
}

export function CollectionHero({
  breadcrumb,
  title,
  description,
  resultsLabel,
  heroAccent,
  headerExtras,
}: CollectionHeroProps) {
  return (
    <section className="border-b border-[var(--border-subtle)] bg-[var(--surface-subtle)]">
      <div className="mx-auto w-full max-w-[var(--container-max)] px-4 pb-5 pt-5 sm:px-6 lg:px-8 lg:pb-7 lg:pt-6">
        {breadcrumb && (
          <div className="mb-3 text-[length:var(--text-xs)] text-[var(--text-tertiary)]">
            {breadcrumb}
          </div>
        )}

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="min-w-0 flex-1">
            <h1
              className={cn(
                'text-[length:var(--font-size-heading-xl)] font-bold tracking-[-0.02em]',
                'leading-[var(--line-height-tight)] text-[var(--text-primary)]',
                'sm:text-[length:var(--font-size-display-sm)]',
              )}
            >
              {title}
            </h1>
            {description && (
              <p
                className={cn(
                  'mt-2 max-w-[60ch]',
                  'text-[length:var(--text-base)] leading-[var(--line-height-relaxed)] text-[var(--text-secondary)]',
                )}
              >
                {description}
              </p>
            )}
            {resultsLabel && (
              <p className="mt-3 text-sm font-medium text-[var(--text-tertiary)]">{resultsLabel}</p>
            )}
          </div>

          {heroAccent && (
            <div className="hidden md:flex md:shrink-0 md:items-center md:justify-end">
              {heroAccent}
            </div>
          )}
        </div>

        {headerExtras && <div className="mt-5">{headerExtras}</div>}
      </div>
    </section>
  )
}
