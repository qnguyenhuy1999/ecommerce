'use client'

import React from 'react'

import { Search, ChevronDown, Mail, Bell } from 'lucide-react'

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  Input,
  IconButton,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  Badge,
} from '@ecom/ui'
import { cn } from '@ecom/ui/utils'

import { NotificationPanel } from '../NotificationPanel/NotificationPanel'
import type { NotificationItem } from '../NotificationPanel/NotificationPanel'
import { DEFAULT_USER_MENU_ITEMS, type AdminHeaderUserMenuItem } from './AdminHeader.fixtures'

export type { AdminHeaderUserMenuItem }

// ─── Shared internal element ─────────────────────────────────────────────────
const NotificationDot = () => (
  <span className="absolute right-2 top-2 w-[7px] h-[7px] rounded-full bg-[var(--intent-danger)]" />
)

export interface AdminHeaderUser {
  name: string
  email?: string
  role?: string
  avatarUrl?: string
  initials?: string
}

export interface AdminHeaderIconButtonProps {
  label: string
  icon: React.ReactNode
  onClick?: () => void
  hasNotification?: boolean
}

export interface AdminHeaderNotificationPanel {
  notifications: NotificationItem[]
  onMarkRead?: (id: string) => void
  onMarkAllRead?: () => void
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
  iconButtons?: AdminHeaderIconButtonProps[]
  user?: AdminHeaderUser | false
  userMenuItems?: AdminHeaderUserMenuItem[] | false
  notificationPanel?: AdminHeaderNotificationPanel | false
  onUserClick?: () => void
}

function AdminHeader({
  title,
  search,
  leading,
  iconButtons,
  user,
  userMenuItems,
  notificationPanel,
  onUserClick,
  className,
  ...props
}: AdminHeaderProps) {
  const resolvedUser = user === false ? undefined : user
  const resolvedNotificationPanel = notificationPanel === false ? undefined : notificationPanel

  const resolvedUserMenuItems =
    userMenuItems === false ? [] : (userMenuItems ?? DEFAULT_USER_MENU_ITEMS)

  const resolvedIconButtons =
    iconButtons ??
    (resolvedNotificationPanel
      ? [
          {
            label: 'Messages',
            icon: <Mail className="w-4 h-4" />,
            onClick: undefined,
          },
        ]
      : [
          {
            label: 'Messages',
            icon: <Mail className="w-4 h-4" />,
            onClick: undefined,
          },
          {
            label: 'Notifications',
            icon: <Bell className="w-4 h-4" />,
            hasNotification: true,
            onClick: undefined,
          },
        ])

  const unreadCount = resolvedNotificationPanel
    ? resolvedNotificationPanel.notifications.filter((notification) => !notification.read).length
    : 0

  const userTrigger = (
    <Button
      type="button"
      variant="ghost"
      onClick={onUserClick}
      className={cn(
        'h-auto min-h-0 min-w-0 justify-start',
        'gap-2 rounded-[var(--radius-md)] py-1 px-2 ml-2',
        'border border-transparent hover:border-[var(--border-subtle)] hover:bg-[var(--surface-elevated)]',
        'focus-visible:ring-[var(--action-primary)]',
      )}
    >
      <Avatar className="w-9 h-9 shrink-0 border border-[var(--border-default)] shadow-xs">
        {resolvedUser?.avatarUrl && (
          <AvatarImage src={resolvedUser.avatarUrl} alt={resolvedUser?.name ?? 'Admin'} />
        )}
        <AvatarFallback className="bg-[var(--action-primary)] text-[var(--action-primary-foreground)] font-semibold text-[length:var(--text-micro)]">
          {resolvedUser?.initials ?? resolvedUser?.name?.charAt(0).toUpperCase() ?? 'A'}
        </AvatarFallback>
      </Avatar>
      <div className="hidden md:flex flex-col items-start min-w-4">
        <span className="text-sm font-semibold leading-tight text-[var(--text-primary)]">
          {resolvedUser?.name ?? 'Marcus George'}
        </span>
        <span className="text-[length:var(--text-micro)] font-medium leading-tight mt-0.5 text-[var(--text-secondary)]">
          {resolvedUser?.role ?? 'Admin'}
        </span>
      </div>
      <ChevronDown className="hidden md:block w-3 h-3 text-[var(--text-tertiary)]" />
    </Button>
  )

  return (
    <header
      className={cn(
        'sticky top-0 z-[var(--layer-sticky)] flex w-full items-center',
        'h-[var(--admin-header-height)] bg-[var(--surface-base)]',
        'border-b border-[var(--border-subtle)]',
        'px-4 sm:px-6 gap-3 sm:gap-4',
        className,
      )}
      {...props}
    >
      {/* Leading / Title */}
      <div className="flex min-w-0 shrink-0 items-center gap-4">
        {leading && <div className="shrink-0">{leading}</div>}
        {title && !leading && (
          <h1 className="truncate text-2xl font-bold leading-tight tracking-[-0.01em] text-[var(--text-primary)]">
            {title}
          </h1>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search Input */}
      {search !== false && (
        <div className="hidden lg:block w-full max-w-80">
          <Input
            type="search"
            placeholder={search?.placeholder ?? 'Search stock, order, etc'}
            onChange={(e) => search?.onChange?.(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') search?.onSearch?.(e.currentTarget.value)
            }}
            suffixIcon={<Search className="w-4 h-4 text-[var(--text-tertiary)]" />}
            className={cn(
              'h-10 rounded-full',
              'border-[var(--border-subtle)] bg-[var(--surface-elevated)]/92 shadow-[var(--elevation-xs)]',
              'text-sm text-[var(--input-fg)] placeholder:text-[var(--text-tertiary)]',
              'focus-visible:ring-[var(--action-primary)]',
            )}
          />
        </div>
      )}

      {/* Utility Actions */}
      <div className="flex shrink-0 items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)]/78 px-1 py-1 shadow-[var(--elevation-xs)]">
        {resolvedIconButtons.map((btn, i) => (
          <div key={i} className="relative">
            <IconButton
              icon={btn.icon}
              label={btn.label}
              onClick={btn.onClick}
              className={cn(
                'rounded-full text-[var(--text-secondary)]',
                'hover:bg-[var(--state-hover)] hover:text-[var(--text-primary)]',
                'focus-visible:ring-[var(--action-primary)]',
              )}
            />
            {btn.hasNotification && <NotificationDot />}
          </div>
        ))}

        {resolvedNotificationPanel && (
          <NotificationPanel
            notifications={resolvedNotificationPanel.notifications}
            onMarkRead={resolvedNotificationPanel.onMarkRead}
            onMarkAllRead={resolvedNotificationPanel.onMarkAllRead}
            trigger={
              <div className="relative">
                <IconButton
                  icon={<Bell className="w-4 h-4" />}
                  label="Notifications"
                  className={cn(
                    'rounded-full text-[var(--text-secondary)]',
                    'hover:bg-[var(--state-hover)] hover:text-[var(--text-primary)]',
                    'focus-visible:ring-[var(--action-primary)]',
                  )}
                />
                {unreadCount > 0 && <NotificationDot />}
              </div>
            }
          />
        )}

        {/* User Avatar & Dropdown */}
        {user !== false &&
          (resolvedUserMenuItems.length > 0 ? (
            <Dropdown>
              <DropdownTrigger asChild>{userTrigger}</DropdownTrigger>
              <DropdownContent
                align="end"
                sideOffset={10}
                className={cn(
                  'w-[21rem] rounded-[var(--radius-md)] p-2',
                  'border-[var(--border-subtle)] bg-[var(--surface-base)]',
                  'shadow-[var(--elevation-dropdown)]',
                )}
              >
                <div
                  className={cn(
                    'mb-2 flex items-center gap-3',
                    'rounded-[var(--radius-lg)] border border-[var(--border-subtle)]',
                    'px-3 py-2',
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[length:var(--text-lg)] font-semibold leading-tight text-[var(--text-primary)]">
                      {resolvedUser?.name ?? 'Sophie Bennett'}
                    </p>
                    <p className="truncate text-sm leading-tight text-[var(--text-secondary)] mt-1">
                      {resolvedUser?.email ?? resolvedUser?.role ?? 'sophie@ui.live'}
                    </p>
                  </div>
                  <Avatar className="h-11 w-11 shrink-0 border border-[var(--border-default)]">
                    {resolvedUser?.avatarUrl && (
                      <AvatarImage
                        src={resolvedUser.avatarUrl}
                        alt={resolvedUser?.name ?? 'Admin'}
                      />
                    )}
                    <AvatarFallback className="bg-[var(--action-primary)] text-[var(--action-primary-foreground)] font-semibold">
                      {resolvedUser?.initials ?? resolvedUser?.name?.charAt(0).toUpperCase() ?? 'A'}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {resolvedUserMenuItems.map((item, index) => {
                  const previousItem = resolvedUserMenuItems[index - 1]
                  const previousSection = previousItem?.section ?? 'primary'
                  const currentSection = item.section ?? 'primary'
                  const showSectionDivider = index > 0 && previousSection !== currentSection

                  return (
                    <React.Fragment key={item.id}>
                      {showSectionDivider && (
                        <div className="my-2 h-px bg-[var(--border-subtle)]" aria-hidden="true" />
                      )}
                      <DropdownItem
                        onSelect={() => item.onSelect?.()}
                        className={cn(
                          'h-11 rounded-[var(--radius-md)] px-3',
                          'text-[length:var(--text-base)] text-[var(--text-primary)]',
                          'focus:bg-[var(--surface-muted)] focus:text-[var(--text-primary)]',
                          item.highlighted && 'bg-[var(--surface-muted)]',
                          item.destructive &&
                            'text-[var(--intent-danger)] focus:text-[var(--intent-danger)]',
                        )}
                      >
                        <span className="text-current">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>

                        {item.badge ? (
                          <Badge
                            variant={item.badge.variant ?? 'secondary'}
                            size="sm"
                            icon={item.badge.icon}
                            className="ml-auto h-6 rounded-[var(--radius-sm)] px-2 text-[length:var(--text-micro)]"
                          >
                            {item.badge.label}
                          </Badge>
                        ) : (
                          item.rightSlot
                        )}
                      </DropdownItem>
                    </React.Fragment>
                  )
                })}
              </DropdownContent>
            </Dropdown>
          ) : (
            userTrigger
          ))}
      </div>
    </header>
  )
}

// (legacy export removed — export replaced by compound export at end)

// Compound subcomponents for composition
function AdminHeaderLeading({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex min-w-0 shrink-0 items-center gap-4', className)} {...props}>
      {children}
    </div>
  )
}
;(AdminHeaderLeading as unknown as { displayName?: string }).displayName = 'AdminHeader.Leading'

function AdminHeaderTitle({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        'truncate text-2xl font-bold leading-tight tracking-[-0.01em] text-[var(--text-primary)]',
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  )
}
;(AdminHeaderTitle as unknown as { displayName?: string }).displayName = 'AdminHeader.Title'

type AdminHeaderSearchProps = {
  placeholder?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  className?: string
} & Omit<React.ComponentProps<typeof Input>, 'onChange'>

function AdminHeaderSearch({
  placeholder,
  onChange,
  onSearch,
  className,
  ...props
}: AdminHeaderSearchProps) {
  return (
    <div className={cn('hidden lg:block w-full max-w-80', className)}>
      <Input
        type="search"
        placeholder={placeholder ?? 'Search stock, order, etc'}
        onChange={(e) => onChange?.((e.target as HTMLInputElement).value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSearch?.((e.currentTarget as HTMLInputElement).value)
        }}
        suffixIcon={<Search className="w-4 h-4 text-[var(--text-tertiary)]" />}
        className={cn(
          'h-9 rounded-full',
          'border-[var(--border-subtle)] bg-[var(--surface-muted)]',
          'text-sm text-[var(--input-fg)] placeholder:text-[var(--text-tertiary)]',
          'focus-visible:ring-[var(--action-primary)]',
        )}
        {...(props as Omit<React.ComponentProps<typeof Input>, 'onChange'>)}
      />
    </div>
  )
}
;(AdminHeaderSearch as unknown as { displayName?: string }).displayName = 'AdminHeader.Search'

function AdminHeaderActions({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex shrink-0 items-center gap-1', className)} {...props}>
      {children}
    </div>
  )
}
;(AdminHeaderActions as unknown as { displayName?: string }).displayName = 'AdminHeader.Actions'

function AdminHeaderIconButton({
  icon,
  label,
  hasNotification,
  onClick,
  className,
  ...props
}: {
  icon: React.ReactNode
  label: string
  hasNotification?: boolean
  onClick?: () => void
  className?: string
} & Omit<React.ComponentProps<typeof IconButton>, 'icon' | 'label' | 'onClick' | 'className'>) {
  return (
    <div className="relative">
      <IconButton
        icon={icon}
        label={label}
        onClick={onClick}
        className={cn(
          'rounded-full text-[var(--text-secondary)]',
          'hover:bg-[var(--state-hover)] hover:text-[var(--text-primary)]',
          'focus-visible:ring-[var(--action-primary)]',
          className,
        )}
        {...(props as Omit<
          React.ComponentProps<typeof IconButton>,
          'icon' | 'label' | 'onClick' | 'className'
        >)}
      />
      {hasNotification && <NotificationDot />}
    </div>
  )
}
;(AdminHeaderIconButton as unknown as { displayName?: string }).displayName =
  'AdminHeader.IconButton'

function AdminHeaderUser({
  user: userProp,
  userMenuItems: userMenuItemsProp,
  onUserClick: onUserClickProp,
}: {
  user?: AdminHeaderUser | false
  userMenuItems?: AdminHeaderUserMenuItem[] | false
  onUserClick?: () => void
}) {
  const resolvedUser = userProp === false ? undefined : userProp
  const resolvedUserMenuItems =
    userMenuItemsProp === false ? [] : (userMenuItemsProp ?? DEFAULT_USER_MENU_ITEMS)

  const userTrigger = (
    <Button
      type="button"
      variant="ghost"
      onClick={onUserClickProp}
      className={cn(
        'h-auto min-h-0 min-w-0 justify-start',
        'gap-2 rounded-[var(--radius-md)] py-1 px-2 ml-2',
        'border border-transparent hover:border-[var(--border-subtle)] hover:bg-[var(--surface-elevated)]',
        'focus-visible:ring-[var(--action-primary)]',
      )}
    >
      <Avatar className="w-9 h-9 shrink-0 border border-[var(--border-default)] shadow-xs">
        {resolvedUser?.avatarUrl && (
          <AvatarImage src={resolvedUser.avatarUrl} alt={resolvedUser?.name ?? 'Admin'} />
        )}
        <AvatarFallback className="bg-[var(--action-primary)] text-[var(--action-primary-foreground)] font-semibold text-[length:var(--text-micro)]">
          {resolvedUser?.initials ?? resolvedUser?.name?.charAt(0).toUpperCase() ?? 'A'}
        </AvatarFallback>
      </Avatar>
      <div className="hidden md:flex flex-col items-start min-w-4">
        <span className="text-sm font-semibold leading-tight text-[var(--text-primary)]">
          {resolvedUser?.name ?? 'Marcus George'}
        </span>
        <span className="text-[length:var(--text-micro)] font-medium leading-tight mt-0.5 text-[var(--text-secondary)]">
          {resolvedUser?.role ?? 'Admin'}
        </span>
      </div>
      <ChevronDown className="hidden md:block w-3 h-3 text-[var(--text-tertiary)]" />
    </Button>
  )

  if (resolvedUserMenuItems.length > 0) {
    return (
      <Dropdown>
        <DropdownTrigger asChild>{userTrigger}</DropdownTrigger>
        <DropdownContent
          align="end"
          sideOffset={10}
          className={cn(
            'w-[21rem] rounded-[var(--radius-md)] p-2',
            'border-[var(--border-subtle)] bg-[var(--surface-base)]',
            'shadow-[var(--elevation-dropdown)]',
          )}
        >
          <div
            className={cn(
              'mb-2 flex items-center gap-3',
              'rounded-[var(--radius-lg)] border border-[var(--border-subtle)]',
              'px-3 py-2',
            )}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[length:var(--text-lg)] font-semibold leading-tight text-[var(--text-primary)]">
                {resolvedUser?.name ?? 'Sophie Bennett'}
              </p>
              <p className="truncate text-sm leading-tight text-[var(--text-secondary)] mt-1">
                {resolvedUser?.email ?? resolvedUser?.role ?? 'sophie@ui.live'}
              </p>
            </div>
            <Avatar className="h-11 w-11 shrink-0 border border-[var(--border-default)]">
              {resolvedUser?.avatarUrl && (
                <AvatarImage src={resolvedUser.avatarUrl} alt={resolvedUser?.name ?? 'Admin'} />
              )}
              <AvatarFallback className="bg-[var(--action-primary)] text-[var(--action-primary-foreground)] font-semibold">
                {resolvedUser?.initials ?? resolvedUser?.name?.charAt(0).toUpperCase() ?? 'A'}
              </AvatarFallback>
            </Avatar>
          </div>

          {resolvedUserMenuItems.map((item, index) => {
            const previousItem = resolvedUserMenuItems[index - 1]
            const previousSection = previousItem?.section ?? 'primary'
            const currentSection = item.section ?? 'primary'
            const showSectionDivider = index > 0 && previousSection !== currentSection

            return (
              <React.Fragment key={item.id}>
                {showSectionDivider && (
                  <div className="my-2 h-px bg-[var(--border-subtle)]" aria-hidden="true" />
                )}
                <DropdownItem
                  onSelect={() => item.onSelect?.()}
                  className={cn(
                    'h-11 rounded-[var(--radius-md)] px-3',
                    'text-[length:var(--text-base)] text-[var(--text-primary)]',
                    'focus:bg-[var(--surface-muted)] focus:text-[var(--text-primary)]',
                    item.highlighted && 'bg-[var(--surface-muted)]',
                    item.destructive &&
                      'text-[var(--intent-danger)] focus:text-[var(--intent-danger)]',
                  )}
                >
                  <span className="text-current">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>

                  {item.badge ? (
                    <Badge
                      variant={item.badge.variant ?? 'secondary'}
                      size="sm"
                      icon={item.badge.icon}
                      className="ml-auto h-6 rounded-[var(--radius-sm)] px-2 text-[length:var(--text-micro)]"
                    >
                      {item.badge.label}
                    </Badge>
                  ) : (
                    item.rightSlot
                  )}
                </DropdownItem>
              </React.Fragment>
            )
          })}
        </DropdownContent>
      </Dropdown>
    )
  }

  return userTrigger
}
;(AdminHeaderUser as unknown as { displayName?: string }).displayName = 'AdminHeader.User'

type AdminHeaderCompound = typeof AdminHeader & {
  Leading: typeof AdminHeaderLeading
  Title: typeof AdminHeaderTitle
  Search: typeof AdminHeaderSearch
  Actions: typeof AdminHeaderActions
  IconButton: typeof AdminHeaderIconButton
  User: typeof AdminHeaderUser
}

const AdminHeaderCompound = Object.assign(AdminHeader, {
  Leading: AdminHeaderLeading,
  Title: AdminHeaderTitle,
  Search: AdminHeaderSearch,
  Actions: AdminHeaderActions,
  IconButton: AdminHeaderIconButton,
  User: AdminHeaderUser,
}) as AdminHeaderCompound

export { AdminHeaderCompound as AdminHeader }
