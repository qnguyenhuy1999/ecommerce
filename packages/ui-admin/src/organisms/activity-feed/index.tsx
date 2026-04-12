import { cn, Avatar, AvatarFallback, AvatarImage } from '@ecom/ui'

export interface ActivityItem {
  id: string
  user: {
    name: string
    avatar?: string
  }
  action: React.ReactNode
  target?: string
  timestamp: string
}

export interface ActivityFeedProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ActivityItem[]
}

function ActivityFeed({ items, className, ...props }: ActivityFeedProps) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex gap-4 p-3 rounded-[8px] hover:bg-muted/50 transition-colors"
        >
          <Avatar className="w-8 h-8 shrink-0">
            {item.user.avatar && <AvatarImage src={item.user.avatar} alt={item.user.name} />}
            <AvatarFallback className="text-xs">{item.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground">
              <span className="font-semibold">{item.user.name}</span>{' '}
              <span className="text-muted-foreground">{item.action}</span>{' '}
              {item.target && <span className="font-medium">{item.target}</span>}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{item.timestamp}</p>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="p-4 text-center text-sm text-muted-foreground">No recent activity</div>
      )}
    </div>
  )
}

export { ActivityFeed }
