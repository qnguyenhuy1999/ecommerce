'use client'

import { Search, Bell } from 'lucide-react'

import { cn, Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from '@ecom/ui'

import type { HeaderProps, HeaderUserMenuProps } from './types'

function Header({ title, subtitle, actions, className, ...props }: HeaderProps) {
  return (
    <header className={cn('admin-header', className)} {...props}>
      <div className="flex-1 flex items-center gap-4 border-r pr-6 h-full mr-6">
        {title && <h1 className="text-lg font-semibold text-foreground leading-none">{title}</h1>}
        {subtitle && (
          <p className="text-sm text-muted-foreground ml-2 hidden sm:block">{subtitle}</p>
        )}
      </div>

      {/* Search Bar - Replace with CommandMenu trigger in real usage */}
      <div className="flex-1 max-w-md hidden md:flex items-center gap-2 bg-muted/50 rounded-[8px] px-3 py-1.5 focus-within:ring-2 focus-within:ring-ring">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent border-none outline-none text-sm w-full h-6"
        />
        <kbd className="hidden lg:inline-flex items-center gap-1 bg-background border px-1.5 rounded text-[10px] font-medium text-muted-foreground mr-1 h-5">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      <div className="flex-1 flex items-center justify-end gap-3">{actions}</div>
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
      <button className="relative w-8 h-8 rounded-full flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand ring-2 ring-background" />
      </button>

      <Dropdown>
        <DropdownTrigger asChild>
          <button
            className={cn(
              'flex items-center gap-2 hover:opacity-80 transition-opacity outline-none',
              className,
            )}
          >
            <div className="w-8 h-8 rounded-full bg-brand text-brand-foreground flex items-center justify-center text-sm font-medium shadow-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:flex flex-col items-start pr-1">
              <span className="text-sm font-medium leading-none">{userName}</span>
              {userEmail && (
                <span className="text-[11px] text-muted-foreground leading-none mt-1">
                  {userEmail}
                </span>
              )}
            </div>
          </button>
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
