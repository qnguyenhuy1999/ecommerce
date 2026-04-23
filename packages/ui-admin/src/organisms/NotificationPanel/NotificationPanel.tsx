'use client'

import React, { useState } from 'react'

import { Bell, ChevronRight, Settings } from 'lucide-react'

import {
  Button,
  cn,
  EmptyState,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
} from '@ecom/ui'

import { NOTIFICATION_TYPE_CONFIG } from './NotificationPanel.fixtures'

export interface NotificationItem {
  id: string
  title: string
  message: string
  read: boolean
  timestamp: string
  type: 'info' | 'success' | 'warning' | 'error' | 'order'
}

export interface NotificationPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  notifications: NotificationItem[]
  onMarkRead?: (id: string) => void
  onMarkAllRead?: () => void
  trigger?: React.ReactNode
}

type TabValue = 'all' | 'archived'

function setDisplayName<T>(component: T, name: string): T {
  ;(component as { displayName?: string }).displayName = name
  return component
}

function NotificationPanel({
  notifications,
  onMarkRead,
  onMarkAllRead,
  trigger,
  className,
  children,
  ...props
}: NotificationPanelProps & { children?: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabValue>('all')

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications =
    activeTab === 'archived' ? notifications.filter((n) => n.read) : notifications

  const providerValue = React.useMemo(
    () => ({
      notifications,
      filteredNotifications,
      onMarkRead,
      onMarkAllRead,
      unreadCount,
      activeTab,
      setActiveTab,
    }),
    [notifications, filteredNotifications, onMarkRead, onMarkAllRead, unreadCount, activeTab],
  )

  const defaultTrigger = (
    <Button variant="ghost" size="icon" className="relative h-9 w-9">
      <Bell className="h-5 w-5 text-muted-foreground" />
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
          <span className="animate-ping w-full h-full rounded-full bg-brand opacity-75 absolute"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand ring-2 ring-background"></span>
        </span>
      )}
    </Button>
  )

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger || defaultTrigger}</PopoverTrigger>
      <PopoverContent
        align="end"
        className={cn(
          'w-[24rem] sm:w-[28rem] p-0 overflow-hidden shadow-[var(--elevation-modal)] rounded-[var(--radius-md)] border',
          className,
        )}
        {...props}
      >
        <NotificationPanelContext.Provider value={providerValue}>
          {children ? (
            children
          ) : (
            <>
              <div className="px-5 pt-5 pb-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[length:var(--text-xl)] text-[var(--text-primary)]">
                    Notifications
                  </h3>
                  {unreadCount > 0 && onMarkAllRead && (
                    <button
                      className="text-[length:var(--text-sm)] font-medium text-[var(--text-primary)] underline underline-offset-4 decoration-[var(--border-strong)] hover:text-[var(--text-secondary)] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        onMarkAllRead()
                      }}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-md text-[length:var(--text-sm)] font-medium',
                        activeTab === 'all'
                          ? 'bg-[var(--surface-inverse)] text-[var(--text-inverse)]'
                          : 'bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors',
                      )}
                    >
                      All
                      <span className="flex items-center justify-center bg-[var(--text-inverse)] text-[var(--text-primary)] text-[0.625rem] font-bold rounded-[4px] px-1.5 py-0.5 leading-none">
                        {notifications.length}
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab('archived')}
                      className={cn(
                        'px-4 py-1.5 rounded-md text-[length:var(--text-sm)] font-medium',
                        activeTab === 'archived'
                          ? 'bg-[var(--surface-inverse)] text-[var(--text-inverse)]'
                          : 'bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors',
                      )}
                    >
                      Archived
                    </button>
                  </div>
                  <button className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <ScrollArea maxHeight="32rem">
                {filteredNotifications.length === 0 ? (
                  <EmptyState
                    icon={<Bell />}
                    title={
                      activeTab === 'archived' ? 'No archived notifications' : 'All caught up!'
                    }
                    description={
                      activeTab === 'archived'
                        ? 'Read notifications will appear here.'
                        : 'No new notifications to show.'
                    }
                    variant="compact"
                    className="h-full mt-10"
                  />
                ) : (
                  <div className="flex flex-col">
                    {filteredNotifications.map((notification, idx) => {
                      const Config = NOTIFICATION_TYPE_CONFIG[notification.type]
                      const Icon = Config.icon

                      return (
                        <div
                          key={notification.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => !notification.read && onMarkRead?.(notification.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              if (!notification.read) onMarkRead?.(notification.id)
                            }
                          }}
                          className={cn(
                            'group flex gap-4 px-5 py-4 border-b border-[var(--border-subtle)] last:border-0 transition-colors cursor-pointer relative items-start',
                            !notification.read
                              ? 'bg-[var(--action-muted)] hover:bg-[var(--action-muted)]/80'
                              : 'bg-[var(--surface-base)] hover:bg-[var(--surface-hover)]',
                          )}
                          style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
                        >
                          {!notification.read && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--brand-500)] rounded-r-full"></div>
                          )}
                          <div
                            className={cn(
                              'shrink-0 w-11 h-11 rounded-full flex items-center justify-center',
                              Config.bg,
                              Config.color,
                            )}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0 pr-2 pt-0.5">
                            <p className="text-[length:var(--text-base)] font-medium text-[var(--text-primary)] leading-[1.2] mb-1">
                              {notification.title}
                            </p>
                            <p className="text-[length:var(--text-sm)] text-[var(--text-secondary)] mb-1.5">
                              {notification.timestamp} •{' '}
                              <span className="capitalize">{notification.type}</span>
                            </p>
                            {notification.message && (
                              <p className="text-[length:var(--text-sm)] text-[var(--text-primary)] leading-snug line-clamp-2">
                                {notification.message}
                              </p>
                            )}
                          </div>

                          <div className="shrink-0 pt-0.5">
                            <ChevronRight className="w-[var(--space-4)] h-[var(--space-4)] text-[var(--text-tertiary)]" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </ScrollArea>
            </>
          )}
        </NotificationPanelContext.Provider>
      </PopoverContent>
    </Popover>
  )
}

// Context + hooks for compound usage
type NotificationPanelContextValue = {
  notifications: NotificationItem[]
  filteredNotifications: NotificationItem[]
  onMarkRead?: (id: string) => void
  onMarkAllRead?: () => void
  unreadCount: number
  activeTab: TabValue
  setActiveTab: (v: TabValue) => void
}

const NotificationPanelContext = React.createContext<NotificationPanelContextValue | null>(null)

function useNotificationPanel() {
  const ctx = React.useContext(NotificationPanelContext)
  if (!ctx) throw new Error('useNotificationPanel must be used within <NotificationPanel>')
  return ctx
}

// Subcomponents for composition
function NotificationPanelHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { unreadCount, onMarkAllRead, activeTab, setActiveTab, notifications } =
    useNotificationPanel()
  return (
    <div className={cn('px-5 pt-5 pb-4 border-b', className)} {...props}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[length:var(--text-xl)] text-[var(--text-primary)]">
          Notifications
        </h3>
        {unreadCount > 0 && onMarkAllRead && (
          <button
            className="text-[length:var(--text-sm)] font-medium text-[var(--text-primary)] underline underline-offset-4 decoration-[var(--border-strong)] hover:text-[var(--text-secondary)] transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onMarkAllRead()
            }}
          >
            Mark all as read
          </button>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-md text-[length:var(--text-sm)] font-medium',
              activeTab === 'all'
                ? 'bg-[var(--surface-inverse)] text-[var(--text-inverse)]'
                : 'bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors',
            )}
          >
            All
            <span className="flex items-center justify-center bg-[var(--text-inverse)] text-[var(--text-primary)] text-[0.625rem] font-bold rounded-[4px] px-1.5 py-0.5 leading-none">
              {notifications.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={cn(
              'px-4 py-1.5 rounded-md text-[length:var(--text-sm)] font-medium',
              activeTab === 'archived'
                ? 'bg-[var(--surface-inverse)] text-[var(--text-inverse)]'
                : 'bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors',
            )}
          >
            Archived
          </button>
        </div>
        <button className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
setDisplayName(NotificationPanelHeader, 'NotificationPanel.Header')

function NotificationPanelList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { filteredNotifications } = useNotificationPanel()
  return (
    <ScrollArea maxHeight="32rem">
      <div className={cn('flex flex-col', className)} {...props}>
        {filteredNotifications.map((notification, idx) => (
          <NotificationPanelItem key={notification.id} notification={notification} idx={idx} />
        ))}
      </div>
    </ScrollArea>
  )
}
setDisplayName(NotificationPanelList, 'NotificationPanel.List')

function NotificationPanelItem({
  notification,
  idx,
}: {
  notification: NotificationItem
  idx?: number
}) {
  const { onMarkRead } = useNotificationPanel()
  const Config = NOTIFICATION_TYPE_CONFIG[notification.type]
  const Icon = Config.icon

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => !notification.read && onMarkRead?.(notification.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (!notification.read) onMarkRead?.(notification.id)
        }
      }}
      className={cn(
        'group flex gap-4 px-5 py-4 border-b border-[var(--border-subtle)] last:border-0 transition-colors cursor-pointer relative items-start',
        !notification.read
          ? 'bg-[var(--action-muted)] hover:bg-[var(--action-muted)]/80'
          : 'bg-[var(--surface-base)] hover:bg-[var(--surface-hover)]',
      )}
      style={{ animationDelay: `${(idx ?? 0) * 50}ms`, animationFillMode: 'both' }}
    >
      {!notification.read && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--brand-500)] rounded-r-full"></div>
      )}
      <div
        className={cn(
          'shrink-0 w-11 h-11 rounded-full flex items-center justify-center',
          Config.bg,
          Config.color,
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0 pr-2 pt-0.5">
        <p className="text-[length:var(--text-base)] font-medium text-[var(--text-primary)] leading-[1.2] mb-1">
          {notification.title}
        </p>
        <p className="text-[length:var(--text-sm)] text-[var(--text-secondary)] mb-1.5">
          {notification.timestamp} • <span className="capitalize">{notification.type}</span>
        </p>
        {notification.message && (
          <p className="text-[length:var(--text-sm)] text-[var(--text-primary)] leading-snug line-clamp-2">
            {notification.message}
          </p>
        )}
      </div>
      <div className="shrink-0 pt-0.5">
        <ChevronRight className="w-[var(--space-4)] h-[var(--space-4)] text-[var(--text-tertiary)]" />
      </div>
    </div>
  )
}
setDisplayName(NotificationPanelItem, 'NotificationPanel.Item')

function NotificationPanelEmpty(props: React.HTMLAttributes<HTMLDivElement>) {
  const { activeTab } = useNotificationPanel()
  return (
    <div {...props}>
      <EmptyState
        icon={<Bell />}
        title={activeTab === 'archived' ? 'No archived notifications' : 'All caught up!'}
        description={
          activeTab === 'archived'
            ? 'Read notifications will appear here.'
            : 'No new notifications to show.'
        }
        variant="compact"
        className="h-full mt-10"
      />
    </div>
  )
}
setDisplayName(NotificationPanelEmpty, 'NotificationPanel.Empty')

type NotificationPanelComponent = typeof NotificationPanel & {
  Header: typeof NotificationPanelHeader
  List: typeof NotificationPanelList
  Item: typeof NotificationPanelItem
  Empty: typeof NotificationPanelEmpty
}

const NotificationPanelCompound = Object.assign(NotificationPanel, {
  Header: NotificationPanelHeader,
  List: NotificationPanelList,
  Item: NotificationPanelItem,
  Empty: NotificationPanelEmpty,
}) as NotificationPanelComponent

export { NotificationPanelCompound as NotificationPanel }
