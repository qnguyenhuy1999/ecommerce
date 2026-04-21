'use client'

import React from 'react'

import {
  Search,
  ChevronDown,
  Mail,
  Bell,
  User as UserIcon,
  LogOut,
  CircleHelp,
  CreditCard,
  MessageCircle,
  Plus,
  ToggleLeft,
  Zap,
} from 'lucide-react'

import {
  cn,
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
  type BadgeProps,
} from '@ecom/ui'

import { NotificationPanel } from '../NotificationPanel/NotificationPanel'
import type { NotificationItem } from '../NotificationPanel/NotificationPanel'

export interface AdminHeaderUser {
  name: string
  email?: string
  role?: string
  avatarUrl?: string
  initials?: string
}

type AdminHeaderUserMenuSection = 'primary' | 'secondary'

export interface AdminHeaderIconButton {
  label: string
  icon: React.ReactNode
  onClick?: () => void
  hasNotification?: boolean
}

export interface AdminHeaderUserMenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  onSelect?: () => void
  destructive?: boolean
  section?: AdminHeaderUserMenuSection
  highlighted?: boolean
  rightSlot?: React.ReactNode
  badge?: {
    label: string
    icon?: React.ReactNode
    variant?: BadgeProps['variant']
  }
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
  iconButtons?: AdminHeaderIconButton[]
  user?: AdminHeaderUser | false
  userMenuItems?: AdminHeaderUserMenuItem[] | false
  notificationPanel?: AdminHeaderNotificationPanel | false
  onUserClick?: () => void
}

const DEFAULT_USER_MENU_ITEMS: AdminHeaderUserMenuItem[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: <UserIcon className="h-4 w-4" />,
    highlighted: true,
    section: 'primary',
  },
  {
    id: 'community',
    label: 'Community',
    icon: <MessageCircle className="h-4 w-4" />,
    section: 'primary',
    rightSlot: (
      <span className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--surface-muted)] text-[var(--text-secondary)]">
        <Plus className="h-3.5 w-3.5" />
      </span>
    ),
  },
  {
    id: 'subscription',
    label: 'Subscription',
    icon: <CreditCard className="h-4 w-4" />,
    section: 'primary',
    badge: {
      label: 'PRO',
      icon: <Zap className="h-3 w-3" />,
      variant: 'success',
    },
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <ToggleLeft className="h-4 w-4" />,
    section: 'primary',
  },
  {
    id: 'help-center',
    label: 'Help center',
    icon: <CircleHelp className="h-4 w-4" />,
    section: 'secondary',
  },
  {
    id: 'logout',
    label: 'Sign out',
    icon: <LogOut className="h-4 w-4" />,
    destructive: true,
    section: 'secondary',
  },
]

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
            icon: <Mail className="w-[var(--space-4)] h-[var(--space-4)]" />,
            onClick: undefined,
          },
        ]
      : [
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
        'gap-[var(--space-2)] rounded-[var(--radius-md)] py-[var(--space-1)] px-[var(--space-2)] ml-[var(--space-2)]',
        'hover:bg-[var(--state-hover)]',
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
      <div className="hidden md:flex flex-col items-start min-w-[var(--space-4)]">
        <span className="text-[length:var(--text-sm)] font-semibold leading-tight text-[var(--text-primary)]">
          {resolvedUser?.name ?? 'Marcus George'}
        </span>
        <span className="text-[length:var(--text-micro)] font-medium leading-tight mt-0.5 text-[var(--text-secondary)]">
          {resolvedUser?.role ?? 'Admin'}
        </span>
      </div>
      <ChevronDown className="hidden md:block w-[var(--space-3)] h-[var(--space-3)] text-[var(--text-tertiary)]" />
    </Button>
  )

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
          <Input
            type="search"
            placeholder={search?.placeholder ?? 'Search stock, order, etc'}
            onChange={(e) => search?.onChange?.(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') search?.onSearch?.(e.currentTarget.value)
            }}
            suffixIcon={
              <Search className="w-[var(--space-4)] h-[var(--space-4)] text-[var(--text-tertiary)]" />
            }
            className={cn(
              'h-9 rounded-full',
              'border-[var(--border-subtle)] bg-[var(--surface-muted)]',
              'text-[length:var(--text-sm)] text-[var(--input-fg)] placeholder:text-[var(--text-tertiary)]',
              'focus-visible:ring-[var(--action-primary)]',
            )}
          />
        </div>
      )}

      {/* Utility Actions */}
      <div className="flex shrink-0 items-center gap-[var(--space-1)]">
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
            {btn.hasNotification && (
              <span className="absolute right-[var(--space-2)] top-[var(--space-2)] w-[7px] h-[7px] rounded-full bg-[var(--intent-danger)]" />
            )}
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
                  icon={<Bell className="w-[var(--space-4)] h-[var(--space-4)]" />}
                  label="Notifications"
                  className={cn(
                    'rounded-full text-[var(--text-secondary)]',
                    'hover:bg-[var(--state-hover)] hover:text-[var(--text-primary)]',
                    'focus-visible:ring-[var(--action-primary)]',
                  )}
                />
                {unreadCount > 0 && (
                  <span className="absolute right-[var(--space-2)] top-[var(--space-2)] w-[7px] h-[7px] rounded-full bg-[var(--intent-danger)]" />
                )}
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
                  'w-[21rem] rounded-[var(--radius-md)] p-[var(--space-2)]',
                  'border-[var(--border-subtle)] bg-[var(--surface-base)]',
                  'shadow-[var(--elevation-dropdown)]',
                )}
              >
                <div
                  className={cn(
                    'mb-[var(--space-2)] flex items-center gap-[var(--space-3)]',
                    'rounded-[var(--radius-lg)] border border-[var(--border-subtle)]',
                    'px-[var(--space-3)] py-[var(--space-2)]',
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[length:var(--text-lg)] font-semibold leading-tight text-[var(--text-primary)]">
                      {resolvedUser?.name ?? 'Sophie Bennett'}
                    </p>
                    <p className="truncate text-[length:var(--text-sm)] leading-tight text-[var(--text-secondary)] mt-1">
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
                        <div
                          className="my-[var(--space-2)] h-px bg-[var(--border-subtle)]"
                          aria-hidden="true"
                        />
                      )}
                      <DropdownItem
                        onSelect={() => item.onSelect?.()}
                        className={cn(
                          'h-11 rounded-[var(--radius-md)] px-[var(--space-3)]',
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
                            className="ml-auto h-6 rounded-[var(--radius-sm)] px-[var(--space-2)] text-[length:var(--text-micro)]"
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

export { AdminHeader }
