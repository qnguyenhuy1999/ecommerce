'use client'

import { cn, Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from '@ecom/ui'
import type { HeaderProps, HeaderUserMenuProps } from './types'

function Header({ title, subtitle, actions, className, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        'h-14 px-6 flex items-center justify-between border-b bg-background shrink-0',
        className,
      )}
      {...props}
    >
      <div>
        {title && <h1 className="text-lg font-semibold text-foreground leading-none">{title}</h1>}
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
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
    <Dropdown>
      <DropdownTrigger>
        <button
          className={cn('flex items-center gap-2 hover:opacity-80 transition-opacity', className)}
        >
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            {userName.charAt(0).toUpperCase()}
          </div>
        </button>
      </DropdownTrigger>
      <DropdownContent align="end">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{userName}</p>
          {userEmail && <p className="text-xs text-muted-foreground">{userEmail}</p>}
        </div>
        <DropdownItem onClick={onSignOut}>Sign out</DropdownItem>
      </DropdownContent>
    </Dropdown>
  )
}

export { Header, HeaderUserMenu }
export type { HeaderProps, HeaderUserMenuProps }
