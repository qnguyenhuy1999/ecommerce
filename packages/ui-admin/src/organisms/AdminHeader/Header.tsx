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
        'sticky top-0 z-40 flex h-24 w-full items-center gap-6 px-6 md:px-8 lg:px-10 bg-[var(--surface-subtle)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--surface-subtle)]/60',
        className,
      )}
      {...props}
    >
      {/* Leading space / Title */}
      <div className="flex min-w-0 shrink-0 items-center gap-4">
        {leading && <div className="shrink-0">{leading}</div>}
        {title && !leading && (
          <h1 className="text-2xl font-bold tracking-tight text-foreground truncate">{title}</h1>
        )}
      </div>

      {/* spacer to push search and actions right */}
      <div className="flex-1" />

      {/* Search Input (White Pill) */}
      {search !== false && (
        <div className="hidden lg:block w-full max-w-[280px]">
          <div className="relative">
            <input
              type="search"
              placeholder={search?.placeholder ?? 'Search stock, order, etc'}
              onChange={(e) => search?.onChange?.(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') search?.onSearch?.(e.currentTarget.value)
              }}
              className={cn(
                'h-10 w-full rounded-full border-none bg-background shadow-[0_1px_3px_0_rgb(0,0,0,0.05)] pl-4 pr-10 text-sm text-primary transition-shadow',
                'placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-brand-500',
              )}
            />
            <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      )}

      {/* Utility Actions (Right) */}
      <div className="flex shrink-0 items-center gap-1 md:gap-2">
        {/* Render standard dummy Message/Bell if no iconButtons passed, else map props */}
        {(
          iconButtons ?? [
            { label: 'Messages', icon: <Mail className="w-[18px] h-[18px]" />, onClick: undefined },
            { label: 'Notifications', icon: <Bell className="w-[18px] h-[18px]" />, hasNotification: true, onClick: undefined },
          ]
        ).map((btn, i) => (
          <button
            key={i}
            type="button"
            aria-label={btn.label}
            onClick={btn.onClick}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-secondary hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {btn.icon}
            {btn.hasNotification && (
              <span className="absolute right-[9px] top-[9px] h-[7px] w-[7px] rounded-full bg-rose-500" />
            )}
          </button>
        ))}

        {/* User Avatar & Drodown indicator */}
        {user !== false && (
          <button
            type="button"
            onClick={onUserClick}
            className="ml-2 flex items-center gap-3 rounded-full py-1 pl-1 pr-2 hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <Avatar className="h-9 w-9 border border-border shadow-sm">
              {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user?.name ?? 'Admin'} />}
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">
                {user?.initials ?? user?.name?.charAt(0).toUpperCase() ?? 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start min-w-[100px]">
              <span className="text-[13px] font-semibold text-foreground leading-none">
                {user?.name ?? 'Marcus George'}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground leading-none mt-[3px]">
                {user?.role ?? 'Admin'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden md:block ml-1" />
          </button>
        )}
      </div>
    </header>
  )
}

export { AdminHeader }
