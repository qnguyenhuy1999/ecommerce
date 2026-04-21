'use client'

import React from 'react'

import { Search, ChevronDown, Mail, Bell } from 'lucide-react'

import { cn, Avatar, AvatarImage, AvatarFallback } from '@ecom/ui'

export interface AdminHeaderUser {
  name: string
  role?: string
  avatarUrl?: string
  initials?: string
}

export interface AdminHeaderIconButton {
  label: string
  icon: React.ReactNode
  onClick?: () => void
  hasNotification?: boolean
}

export interface AdminHeaderProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
  search?:
    | {
        placeholder?: string
        onChange?: (value: string) => void
        onSearch?: (value: string) => void
      }
    | false
  leading?: React.ReactNode
  iconButtons?: AdminHeaderIconButton[]
  user?: AdminHeaderUser | false
  onUserClick?: () => void
}

function AdminHeader({
  title,
  search,
  leading,
  iconButtons,
  user,
  onUserClick,
  className,
  ...props
}: AdminHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex w-full items-center',
        'h-[var(--admin-header-height)] bg-[var(--surface-base)]',
        'border-b border-[var(--border-subtle)]',
        'px-[var(--space-6)] gap-[var(--space-4)]',
        className,
      )}
      {...props}
    >
      {/* Leading / Title */}
      <div className="flex min-w-0 shrink-0 items-center gap-[var(--space-4)]">
        {leading && <div className="shrink-0">{leading}</div>}
        {title && !leading && (
          <h1 className="truncate text-[length:var(--text-2xl)] font-bold leading-tight tracking-[-0.01em] text-[var(--text-primary)]">
            {title}
          </h1>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search Input */}
      {search !== false && (
        <div className="hidden lg:block w-full max-w-80">
          <div className="relative">
            <input
              type="search"
              placeholder={search?.placeholder ?? 'Search stock, order, etc'}
              onChange={(e) => search?.onChange?.(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') search?.onSearch?.(e.currentTarget.value)
              }}
              className={cn(
                'h-9 w-full rounded-full',
                'border border-[var(--border-subtle)] bg-[var(--surface-muted)]',
                'pl-[var(--space-4)] pr-[var(--space-10)]',
                'text-[length:var(--text-sm)] text-[var(--input-fg)] placeholder:text-[var(--text-tertiary)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--action-primary)]',
              )}
            />
            <Search className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-[var(--space-4)] h-[var(--space-4)] text-[var(--text-tertiary)]" />
          </div>
        </div>
      )}

      {/* Utility Actions */}
      <div className="flex shrink-0 items-center gap-[var(--space-1)]">
        {(
          iconButtons ?? [
            {
              label: 'Messages',
              icon: <Mail className="w-[var(--space-4)] h-[var(--space-4)]" />,
              onClick: undefined,
            },
            {
              label: 'Notifications',
              icon: <Bell className="w-[var(--space-4)] h-[var(--space-4)]" />,
              hasNotification: true,
              onClick: undefined,
            },
          ]
        ).map((btn, i) => (
          <button
            key={i}
            type="button"
            aria-label={btn.label}
            onClick={btn.onClick}
            className={cn(
              'relative flex items-center justify-center cursor-pointer',
              'w-9 h-9 rounded-full',
              'text-[var(--text-secondary)] hover:bg-[var(--state-hover)] hover:text-[var(--text-primary)]',
              'transition-colors duration-[var(--duration-fast)]',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)]',
            )}
          >
            {btn.icon}
            {btn.hasNotification && (
              <span className="absolute right-[var(--space-2)] top-[var(--space-2)] w-[7px] h-[7px] rounded-full bg-[var(--intent-danger)]" />
            )}
          </button>
        ))}

        {/* User Avatar & Dropdown */}
        {user !== false && (
          <button
            type="button"
            onClick={onUserClick}
            className={cn(
              'flex items-center gap-[var(--space-2)] cursor-pointer',
              'rounded-[var(--radius-md)] py-[var(--space-1)] px-[var(--space-2)] ml-[var(--space-2)]',
              'hover:bg-[var(--state-hover)]',
              'transition-colors duration-[var(--duration-fast)]',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-primary)]',
            )}
          >
            <Avatar className="w-9 h-9 shrink-0 border border-[var(--border-default)] shadow-xs">
              {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user?.name ?? 'Admin'} />}
              <AvatarFallback className="bg-[var(--action-primary)] text-[var(--action-primary-foreground)] font-semibold text-[length:var(--text-micro)]">
                {user?.initials ?? user?.name?.charAt(0).toUpperCase() ?? 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start min-w-[var(--space-4)]">
              <span className="text-[length:var(--text-sm)] font-semibold leading-tight text-[var(--text-primary)]">
                {user?.name ?? 'Marcus George'}
              </span>
              <span className="text-[length:var(--text-micro)] font-medium leading-tight mt-0.5 text-[var(--text-secondary)]">
                {user?.role ?? 'Admin'}
              </span>
            </div>
            <ChevronDown className="hidden md:block w-[var(--space-3)] h-[var(--space-3)] text-[var(--text-tertiary)]" />
          </button>
        )}
      </div>
    </header>
  )
}

export { AdminHeader }
