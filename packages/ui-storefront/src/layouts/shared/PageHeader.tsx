import React from 'react'

import { cn } from '@ecom/ui'

/**
 * Compound page header used across storefront dashboards (Wishlist, Order
 * History, Collection, Search, Account). Replaces each layout's hand-rolled
 * `<header>` cluster with a small set of named sub-components so consumers
 * compose only what they need:
 *
 *   <PageHeader>
 *     <PageHeader.Eyebrow>My Account</PageHeader.Eyebrow>
 *     <PageHeader.Title count={4}>My wishlist</PageHeader.Title>
 *     <PageHeader.Description>Items you're saving for later.</PageHeader.Description>
 *     <PageHeader.Actions>{actions}</PageHeader.Actions>
 *   </PageHeader>
 *
 * Children are split client-side via TYPE matching (not stringly-typed names)
 * so consumers can wrap sub-components in fragments / conditionals.
 */

interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Visual density. `default` mirrors the Home reference; `compact` trims the bottom margin. */
  size?: 'compact' | 'default'
}

type PageHeaderEyebrowProps = React.HTMLAttributes<HTMLParagraphElement>
type PageHeaderDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>
type PageHeaderActionsProps = React.HTMLAttributes<HTMLDivElement>

interface PageHeaderTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Optional integrated count rendered inline as a muted suffix, e.g. "My wishlist (4)". */
  count?: number
  level?: 'h1' | 'h2'
}

function PageHeaderEyebrow({ className, ...props }: PageHeaderEyebrowProps) {
  return (
    <p
      className={cn(
        'text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.14em]',
        'text-[var(--text-tertiary)]',
        className,
      )}
      {...props}
    />
  )
}
PageHeaderEyebrow.displayName = 'PageHeader.Eyebrow'

function PageHeaderTitle({
  className,
  count,
  level = 'h1',
  children,
  ...props
}: PageHeaderTitleProps) {
  const Tag = level
  return (
    <Tag
      className={cn(
        'text-[length:var(--font-size-heading-xl)] font-bold tracking-[-0.015em]',
        'leading-[var(--line-height-tight)] text-[var(--text-primary)]',
        'sm:text-[length:var(--font-size-display-sm)]',
        className,
      )}
      {...props}
    >
      {children}
      {typeof count === 'number' && (
        <>
          {' '}
          <span className="font-semibold text-[var(--text-tertiary)]">({count})</span>
        </>
      )}
    </Tag>
  )
}
PageHeaderTitle.displayName = 'PageHeader.Title'

function PageHeaderDescription({ className, ...props }: PageHeaderDescriptionProps) {
  return (
    <p
      className={cn(
        'max-w-[60ch] text-[length:var(--text-base)]',
        'leading-[var(--line-height-relaxed)] text-[var(--text-secondary)]',
        className,
      )}
      {...props}
    />
  )
}
PageHeaderDescription.displayName = 'PageHeader.Description'

function PageHeaderActions({ className, ...props }: PageHeaderActionsProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-[var(--space-2)] shrink-0',
        className,
      )}
      {...props}
    />
  )
}
PageHeaderActions.displayName = 'PageHeader.Actions'

function isElementOfType<P>(
  node: React.ReactNode,
  component: React.ComponentType<P>,
): node is React.ReactElement<P> {
  return React.isValidElement(node) && node.type === component
}

function PageHeader({ className, size = 'default', children, ...props }: PageHeaderProps) {
  const childArray = React.Children.toArray(children)

  const eyebrow = childArray.find((c) => isElementOfType(c, PageHeaderEyebrow))
  const title = childArray.find((c) => isElementOfType(c, PageHeaderTitle))
  const description = childArray.find((c) => isElementOfType(c, PageHeaderDescription))
  const actions = childArray.find((c) => isElementOfType(c, PageHeaderActions))
  const rest = childArray.filter(
    (c) =>
      !isElementOfType(c, PageHeaderEyebrow) &&
      !isElementOfType(c, PageHeaderTitle) &&
      !isElementOfType(c, PageHeaderDescription) &&
      !isElementOfType(c, PageHeaderActions),
  )

  return (
    <header
      className={cn(
        'flex flex-col gap-[var(--space-1)]',
        size === 'default' ? 'mb-[var(--space-6)]' : 'mb-[var(--space-4)]',
        className,
      )}
      {...props}
    >
      {eyebrow}
      <div className="flex flex-wrap items-end justify-between gap-[var(--space-3)]">
        <div className="min-w-0 flex-1 space-y-[var(--space-2)]">
          {title}
          {description}
        </div>
        {actions}
      </div>
      {rest}
    </header>
  )
}

PageHeader.Eyebrow = PageHeaderEyebrow
PageHeader.Title = PageHeaderTitle
PageHeader.Description = PageHeaderDescription
PageHeader.Actions = PageHeaderActions

export { PageHeader }
export type {
  PageHeaderProps,
  PageHeaderTitleProps,
  PageHeaderEyebrowProps,
  PageHeaderDescriptionProps,
  PageHeaderActionsProps,
}
