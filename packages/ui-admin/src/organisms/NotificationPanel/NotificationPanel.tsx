import { Bell, Check, Info, AlertTriangle, CheckCircle, Package } from 'lucide-react'

import {
  cn,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  ScrollArea,
  EmptyState,
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
  info: { icon: Info, color: 'text-info', bg: 'bg-info-muted' },
  success: { icon: CheckCircle, color: 'text-success', bg: 'bg-success-muted' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning-muted' },
  error: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
  order: { icon: Package, color: 'text-brand', bg: 'bg-brand-muted' },
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

  // Group notifications by date (naive approach for demo)
  const today = notifications.slice(0, Math.ceil(notifications.length / 2))
  const earlier = notifications.slice(Math.ceil(notifications.length / 2))

  const renderGroup = (label: string, items: NotificationItem[]) => {
    if (items.length === 0) return null
    return (
      <div className="mb-4 last:mb-0">
        <h4 className="px-4 py-1 text-xs font-semibold text-muted-foreground bg-muted/20 sticky top-0 z-10 backdrop-blur-sm">
          {label}
        </h4>
        <div className="flex flex-col">
          {items.map((notification, idx) => {
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
                  'group flex gap-3 p-4 border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer relative overflow-hidden',
                  !notification.read ? 'bg-accent/30' : 'opacity-75',
                  !notification.read &&
                    'animate-in slide-in-from-right-4 fade-in duration-[var(--motion-normal)]',
                  `style={{ animationDelay: '${idx * 50}ms', animationFillMode: 'both' }}`,
                )}
              >
                {!notification.read && (
                  <span className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand"></span>
                )}
                <div
                  className={cn(
                    'shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5',
                    Config.bg,
                    Config.color,
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <p
                    className={cn(
                      'text-[var(--text-sm)] mb-0.5',
                      !notification.read
                        ? 'font-semibold text-foreground'
                        : 'font-medium text-foreground/80',
                    )}
                  >
                    {notification.title}
                  </p>
                  <p className="text-[var(--text-micro)] text-muted-foreground leading-snug line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-[var(--space-3)] text-muted-foreground/70 mt-1.5">
                    {notification.timestamp}
                  </p>
                </div>

                {/* Swipe/Hover actions */}
                <div className="absolute right-0 top-0 bottom-0 flex items-center
                  translate-x-full group-hover:translate-x-0 transition-transform
                  duration-[var(--motion-fast)] bg-gradient-to-l from-background via-background to-transparent pr-4 pl-8">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-full hover:bg-muted"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Dismiss logic
                    }}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

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
          'w-80 p-0 overflow-hidden shadow-[var(--elevation-modal)] rounded-[var(--radius-lg)] border',
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
          <h3 className="font-semibold text-[var(--text-sm)]">Notifications</h3>
          {unreadCount > 0 && onMarkAllRead && (
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--text-micro)] h-auto p-0 text-brand hover:text-brand-hover font-medium flex items-center gap-1 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                onMarkAllRead()
              }}
            >
              <Check className="w-3 h-3" /> Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[var(--space-12)]">
          {notifications.length === 0 ? (
            <EmptyState
              icon={<Bell />}
              title="All caught up!"
              description="No new notifications to show."
              variant="compact"
              className="h-full mt-10"
            />
          ) : (
            <div className="flex flex-col py-2">
              {renderGroup('Today', today)}
              {renderGroup('Earlier', earlier)}
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t bg-muted/30">
          <Button
            variant="ghost"
            className="w-full text-[var(--text-micro)] h-8 text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { NotificationPanel }
