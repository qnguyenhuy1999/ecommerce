import React from 'react'

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
  isLatest?: boolean
}

export interface ActivityFeedProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ActivityItem[]
  showTimeline?: boolean
}

function ActivityFeed({ items, showTimeline = true, className, ...props }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <div className={cn('py-8 text-center text-sm text-muted-foreground', className)} {...props}>
        No recent activity
      </div>
    )
  }

  return (
    <div className={cn('space-y-0', className)} {...props}>
      {items.map((item, idx) => {
        const isFirst = idx === 0
        const isLast = idx === items.length - 1

        return (
          <div
            key={item.id}
            className="group flex gap-3 py-3 px-3 rounded-[var(--radius-sm)] hover:bg-muted/40 transition-colors duration-[var(--motion-fast)] relative"
          >
            {/* Timeline track */}
            {showTimeline && (
              <div
                className="absolute left-[1.875rem] top-0 bottom-0 w-px bg-border/50 -z-10"
                style={{
                  top: isFirst ? '50%' : 0,
                  bottom: isLast ? '50%' : 0,
                }}
              />
            )}

            {/* Avatar with optional pulse for latest */}
            <div className="relative shrink-0 z-10">
              <Avatar className="w-8 h-8 ring-2 ring-background">
                {item.user.avatar && <AvatarImage src={item.user.avatar} alt={item.user.name} />}
                <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-muted to-muted/60">
                  {item.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {(item.isLatest || isFirst) && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-brand border-2 border-background" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-sm leading-snug text-foreground">
                <span className="font-semibold">{item.user.name}</span>{' '}
                <span className="text-muted-foreground">{item.action}</span>
                {item.target && (
                  <>
                    {' '}
                    <span className="font-medium text-foreground">{item.target}</span>
                  </>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.timestamp}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { ActivityFeed }
