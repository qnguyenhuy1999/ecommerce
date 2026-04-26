import React from 'react'

import { User, Package, MapPin, Heart, Settings, LogOut, ChevronRight } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage, cn } from '@ecom/ui'

export interface AccountSidebarItem {
  id: string
  label: string
  icon: React.ReactNode
  href?: string
  badge?: string
}

/**
 * Canonical "My account" navigation set. Reuse this from any account-context
 * layout so every page presents the same Profile / Orders / Addresses /
 * Wishlist / Settings rail. Logout is rendered separately by AccountSidebar
 * via the `onLogout` prop so it stays visually isolated from primary nav.
 */
export const DEFAULT_ACCOUNT_NAV_ITEMS: AccountSidebarItem[] = [
  { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  { id: 'orders', label: 'Orders', icon: <Package className="w-4 h-4" /> },
  { id: 'addresses', label: 'Addresses', icon: <MapPin className="w-4 h-4" /> },
  { id: 'wishlist', label: 'Wishlist', icon: <Heart className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
]

export interface AccountSidebarUser {
  name: string
  email: string
  avatar?: string
}

export interface AccountSidebarProps {
  user: AccountSidebarUser
  activeItem: string
  items?: AccountSidebarItem[]
  onItemClick?: (id: string) => void
  onLogout?: () => void
  className?: string
}

function AccountSidebar({
  user,
  activeItem,
  items = DEFAULT_ACCOUNT_NAV_ITEMS,
  onItemClick,
  onLogout,
  className,
}: AccountSidebarProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <aside className={cn('space-y-2', className)}>
      {/* User card */}
      <div className="flex items-center gap-3 p-4 rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-base)] shadow-[var(--elevation-surface)] mb-4 overflow-hidden">
        <Avatar className="w-12 h-12 shrink-0">
          {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
          <AvatarFallback className="text-[var(--text-sm)] font-semibold bg-[var(--action-primary)]/10 text-[var(--action-primary)]">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-[var(--text-sm)] font-semibold text-[var(--text-primary)] truncate">
            {user.name}
          </p>
          <p className="text-[length:var(--text-xs)] text-[var(--text-tertiary)] truncate">
            {user.email}
          </p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="space-y-1">
        {items.map((item) => {
          const isActive = item.id === activeItem
          const Wrapper = item.href ? 'a' : 'button'
          return (
            <Wrapper
              key={item.id}
              {...(item.href ? { href: item.href } : { type: 'button' as const })}
              onClick={() => onItemClick?.(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-lg)]',
                'text-[var(--text-sm)] font-medium text-left',
                'transition-all duration-[var(--motion-fast)]',
                isActive
                  ? 'bg-[var(--action-primary)]/10 text-[var(--action-primary)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className={cn(
                  'shrink-0',
                  isActive ? 'text-[var(--action-primary)]' : 'text-[var(--text-tertiary)]',
                )}
              >
                {item.icon}
              </span>
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span className="shrink-0 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-[var(--action-primary)] text-[var(--action-primary-foreground)] text-[length:var(--text-xs)] font-bold">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <ChevronRight className="w-4 h-4 shrink-0 text-[var(--action-primary)]" />
              )}
            </Wrapper>
          )
        })}
      </nav>

      {/* Logout */}
      {onLogout && (
        <div className="pt-3 border-t border-[var(--border-subtle)] mt-3">
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-lg)] text-[var(--text-sm)] font-medium text-[var(--text-secondary)] hover:bg-[var(--intent-destructive)]/10 hover:text-[var(--intent-destructive)] transition-all duration-[var(--motion-fast)]"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      )}
    </aside>
  )
}

export { AccountSidebar }
