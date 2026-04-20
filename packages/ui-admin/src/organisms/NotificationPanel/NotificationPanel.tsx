import {
  AlertTriangle,
  Bell,
  CheckCircle,
  ChevronRight,
  Info,
  Package,
  Settings,
} from 'lucide-react'

import {
  Button,
  cn,
  EmptyState,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
} from '@ecom/ui'

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

const typeConfig = {
  info: { icon: Info, color: 'text-[var(--intent-info)]', bg: 'bg-[var(--intent-info-muted)]' },
  success: {
    icon: CheckCircle,
    color: 'text-[var(--intent-success)]',
    bg: 'bg-[var(--intent-success-muted)]',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-[var(--intent-warning)]',
    bg: 'bg-[var(--intent-warning-muted)]',
  },
  error: {
    icon: AlertTriangle,
    color: 'text-[var(--intent-danger)]',
    bg: 'bg-[var(--intent-danger-muted)]',
  },
  order: { icon: Package, color: 'text-[var(--action-primary)]', bg: 'bg-[var(--action-muted)]' },
}

function NotificationPanel({
  notifications,
  onMarkRead,
  onMarkAllRead,
  trigger,
  className,
  ...props
}: NotificationPanelProps) {
  const unreadCount = notifications.filter((n) => !n.read).length

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
          'w-[24rem] sm:w-[28rem] p-0 overflow-hidden shadow-[var(--elevation-modal)] rounded-[var(--radius-xl)] border',
          className,
        )}
        {...props}
      >
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
              <button className="flex items-center gap-2 px-3 py-1.5 bg-[var(--gray-800)] text-[var(--gray-0)] rounded-md text-[length:var(--text-sm)] font-medium">
                All
                <span className="flex items-center justify-center bg-[var(--gray-0)] text-[var(--gray-900)] text-[0.625rem] font-bold rounded-[4px] px-1.5 py-0.5 leading-none">
                  {notifications.length}
                </span>
              </button>
              <button className="px-4 py-1.5 bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-md text-[length:var(--text-sm)] font-medium transition-colors">
                Archived
              </button>
            </div>
            <button className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <ScrollArea maxHeight="32rem">
          {notifications.length === 0 ? (
            <EmptyState
              icon={<Bell />}
              title="All caught up!"
              description="No new notifications to show."
              variant="compact"
              className="h-full mt-10"
            />
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification, idx) => {
                const Config = typeConfig[notification.type]
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
      </PopoverContent>
    </Popover>
  )
}

export { NotificationPanel }
