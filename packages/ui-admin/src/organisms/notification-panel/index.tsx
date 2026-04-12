import { Bell, Check, Info, AlertTriangle, CheckCircle, Package } from 'lucide-react'
import { cn, Popover, PopoverContent, PopoverTrigger, Button, ScrollArea } from '@ecom/ui'

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
      <PopoverContent align="end" className={cn('w-80 p-0 overflow-hidden', className)} {...props}>
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && onMarkAllRead && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMarkAllRead()
              }}
              className="text-xs text-brand hover:text-brand-hover font-medium flex items-center gap-1"
            >
              <Check className="w-3 h-3" /> Mark all read
            </button>
          )}
        </div>

        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center px-4">
              <Bell className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm font-medium">All caught up!</p>
              <p className="text-xs text-muted-foreground">No new notifications</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => {
                const Config = typeConfig[notification.type]
                const Icon = Config.icon

                return (
                  <div
                    key={notification.id}
                    onClick={() => !notification.read && onMarkRead?.(notification.id)}
                    className={cn(
                      'flex gap-3 p-4 border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer',
                      !notification.read ? 'bg-accent/30' : 'opacity-75 relative',
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
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'text-sm mb-0.5',
                          !notification.read
                            ? 'font-semibold text-foreground'
                            : 'font-medium text-foreground/80',
                        )}
                      >
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-[11px] text-muted-foreground/70 mt-1.5">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t bg-muted/30">
          <Button variant="ghost" className="w-full text-xs h-8 text-muted-foreground">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { NotificationPanel }
