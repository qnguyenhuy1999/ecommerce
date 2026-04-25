'use client'

import React from 'react'

import { Heart, Menu, Search, ShoppingBag, User2 } from 'lucide-react'

import { Button, cn, Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from '@ecom/ui'

import { SearchBar } from '../../molecules/SearchBar/SearchBar'

export interface StorefrontHeaderClientProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: React.ReactNode
  cartCount?: number
  wishlistCount?: number
  onCartClick?: () => void
  onWishlistClick?: () => void
  onSearchClick?: () => void
  onMenuClick?: () => void
  user?: { name: string; avatar?: string }
  onLogin?: () => void
  onLogout?: () => void
  categories?: { label: string; href: string }[]
}

const iconButton = cn(
  'relative inline-flex h-10 w-10 items-center justify-center rounded-full',
  'text-[var(--text-secondary)]',
  'transition-[background-color,color] duration-[var(--motion-fast)]',
  'hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]',
  'focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-base)]',
)

const countBadge = cn(
  'absolute -top-0.5 -right-0.5 inline-flex h-[var(--space-5)] min-w-[var(--space-5)] items-center justify-center',
  'rounded-full bg-brand text-brand-foreground',
  'px-[var(--space-1)] text-[length:var(--text-micro)] font-bold leading-none tabular-nums',
  'ring-2 ring-[var(--surface-base)]',
)

export function StorefrontHeaderClient(props: StorefrontHeaderClientProps) {
  const {
    logo,
    cartCount = 0,
    wishlistCount = 0,
    onCartClick,
    onWishlistClick,
    onSearchClick,
    onMenuClick,
    user,
    onLogin,
    onLogout,
    categories,
    className,
    ...restProps
  } = props

  return (
    <div className={cn('w-full bg-[var(--surface-base)]', className)} {...restProps}>
      <div className="mx-auto flex w-full max-w-[var(--storefront-content-max-width)] items-center gap-[var(--space-4)] px-[var(--space-4)] sm:px-[var(--space-6)] lg:px-[var(--space-8)] h-[var(--storefront-header-height)]">
        {/* Mobile menu */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={onMenuClick}
          className={cn(iconButton, 'lg:hidden')}
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo */}
        {logo && (
          <a
            href="/"
            aria-label="Home"
            className="shrink-0 inline-flex items-center transition-opacity duration-[var(--motion-fast)] hover:opacity-90 focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)] focus-visible:rounded-sm"
          >
            {logo}
          </a>
        )}

        {/* Desktop search */}
        <div className="hidden lg:block flex-1 max-w-2xl mx-auto">
          <SearchBar
            placeholder="Search products, brands and categories"
            suggestions={['New arrivals', 'Best sellers', 'Summer sale']}
          />
        </div>

        {/* Mobile spacer */}
        <div className="flex-1 lg:hidden" />

        {/* Right actions */}
        <div className="flex items-center gap-[var(--space-1)] shrink-0">
          {/* Mobile search trigger */}
          <button
            type="button"
            aria-label="Search"
            onClick={onSearchClick}
            className={cn(iconButton, 'lg:hidden')}
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Wishlist */}
          <button
            type="button"
            aria-label={`Wishlist${wishlistCount ? ` (${wishlistCount})` : ''}`}
            onClick={onWishlistClick}
            className={cn(iconButton, 'hidden sm:inline-flex')}
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className={countBadge}>{wishlistCount > 99 ? '99+' : wishlistCount}</span>
            )}
          </button>

          {/* Account */}
          {user ? (
            <Dropdown>
              <DropdownTrigger asChild>
                <button
                  type="button"
                  aria-label={`Account: ${user.name}`}
                  className={cn(
                    'inline-flex items-center gap-[var(--space-2)]',
                    'h-10 rounded-full px-[var(--space-1)] sm:pr-[var(--space-3)]',
                    'text-[length:var(--text-sm)] font-medium text-[var(--text-primary)]',
                    'transition-[background-color] duration-[var(--motion-fast)]',
                    'hover:bg-[var(--surface-muted)]',
                    'focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-base)]',
                  )}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground text-[length:var(--text-sm)] font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden sm:inline truncate max-w-[7rem]">
                    {user.name.split(' ')[0]}
                  </span>
                </button>
              </DropdownTrigger>
              <DropdownContent align="end" sideOffset={8} className="w-56">
                <DropdownItem className="text-[length:var(--text-sm)]">Profile</DropdownItem>
                <DropdownItem className="text-[length:var(--text-sm)]">Orders</DropdownItem>
                <DropdownItem className="text-[length:var(--text-sm)]">Wishlist</DropdownItem>
                <DropdownItem className="text-[length:var(--text-sm)]">Settings</DropdownItem>
                <div className="my-[var(--space-1)] mx-[var(--space-2)] h-px bg-[var(--border-subtle)]" />
                <DropdownItem
                  onClick={onLogout}
                  className="text-[length:var(--text-sm)] text-[var(--intent-danger)] focus:bg-[var(--intent-danger-muted)] focus:text-[var(--intent-danger)]"
                >
                  Log out
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
          ) : (
            <>
              <button
                type="button"
                aria-label="Account"
                onClick={onLogin}
                className={cn(iconButton, 'sm:hidden')}
              >
                <User2 className="h-5 w-5" />
              </button>
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex rounded-full"
                onClick={onLogin}
              >
                Sign in
              </Button>
            </>
          )}

          {/* Cart */}
          <button
            type="button"
            aria-label={`Cart${cartCount ? ` (${cartCount})` : ''}`}
            onClick={onCartClick}
            className={iconButton}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className={countBadge}>{cartCount > 99 ? '99+' : cartCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Category nav row */}
      {categories && categories.length > 0 && (
        <div className="border-t border-[var(--border-subtle)] bg-[var(--surface-base)]">
          <nav
            aria-label="Categories"
            className={cn(
              'mx-auto flex w-full max-w-[var(--storefront-content-max-width)] items-center gap-[var(--space-1)]',
              'overflow-x-auto px-[var(--space-3)] sm:px-[var(--space-5)] lg:px-[var(--space-7)]',
              'h-[var(--space-11)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
            )}
          >
            {categories.map((cat) => (
              <a
                key={cat.href}
                href={cat.href}
                className={cn(
                  'shrink-0 inline-flex items-center rounded-[var(--radius-sm)]',
                  'px-[var(--space-3)] py-[var(--space-1-5)]',
                  'text-[length:var(--text-sm)] font-medium text-[var(--text-secondary)]',
                  'transition-colors duration-[var(--motion-fast)]',
                  'hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]',
                  'focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)]',
                )}
              >
                {cat.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}
