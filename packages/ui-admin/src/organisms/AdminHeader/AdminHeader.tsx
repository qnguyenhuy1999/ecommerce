'use client'

import { Search, Bell } from 'lucide-react'

import { cn, Dropdown, DropdownTrigger, DropdownContent, DropdownItem, Button } from '@ecom/ui'

import type { HeaderProps, HeaderUserMenuProps } from './types'

function Header({ title, subtitle, actions, className, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        'admin-header sticky top-0 z-40 flex items-center justify-between w-full min-h-[4rem] px-6 gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm',
        className,
      )}
      {...props}
    >
      <div className="flex-1 flex flex-col justify-center min-w-0 pr-4">
        {title && (
          <h1 className="text-xl font-semibold text-foreground tracking-tight truncate">{title}</h1>
        )}
        {subtitle && <p className="text-sm text-muted-foreground truncate mt-0.5">{subtitle}</p>}
      </div>

      {/* Search Bar / Command Palette Trigger */}
      <button
        type="button"
        className="hidden md:flex flex-1 max-w-md items-center gap-2 bg-muted/50 hover:bg-muted rounded-md px-3 py-1.5 border border-border/50 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => {
          // Command palette will be triggered here
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
        }}
      >
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="flex-1 text-sm text-muted-foreground truncate">Search everywhere...</span>
        <kbd className="hidden lg:inline-flex items-center gap-1 bg-background border px-1.5 rounded text-[var(--text-micro)] font-medium text-muted-foreground h-5 shadow-sm">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <div className="flex-1 flex items-center justify-end gap-3 min-w-0">{actions}</div>
    </header>
  )
}

function HeaderUserMenu({
  userName = 'Admin User',
  userEmail,
  onSignOut,
  className,
}: HeaderUserMenuProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Notification Bell */}
      <Button variant="ghost" size="icon" className="relative h-9 w-9">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand ring-2 ring-background" />
      </Button>

      <Dropdown>
        <DropdownTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              'flex items-center gap-2 hover:opacity-80 transition-opacity outline-none px-2 py-1.5 h-auto',
              className,
            )}
          >
            <div className="w-8 h-8 rounded-full bg-brand text-brand-foreground flex items-center justify-center text-sm font-medium shadow-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:flex flex-col items-start pr-1">
              <span className="text-sm font-medium leading-none">{userName}</span>
              {userEmail && (
                <span className="text-[var(--space-3)] text-muted-foreground leading-none mt-1">
                  {userEmail}
                </span>
              )}
            </div>
          </Button>
        </DropdownTrigger>
        <DropdownContent align="end" className="w-56">
          <div className="px-2 py-2 mb-1 border-b md:hidden">
            <p className="text-sm font-medium">{userName}</p>
            {userEmail && <p className="text-xs text-muted-foreground">{userEmail}</p>}
          </div>
          <DropdownItem>Profile</DropdownItem>
          <DropdownItem>Settings</DropdownItem>
          <div className="h-px bg-border my-1" />
          <DropdownItem
            onClick={onSignOut}
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            Sign out
          </DropdownItem>
        </DropdownContent>
      </Dropdown>
    </div>
  )
}

export { Header, HeaderUserMenu }
export type { HeaderProps, HeaderUserMenuProps }
