'use client'

import React from 'react'

import { Avatar, AvatarImage, AvatarFallback } from '../../atoms/Avatar/Avatar'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '../../atoms/Tooltip/Tooltip'
import { cn } from '../../lib/utils'

export interface AvatarGroupItem {
  name: string
  src?: string
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of avatar data */
  items: AvatarGroupItem[]
  /** Maximum number of avatars to display before the "+N" overflow */
  max?: number
  /** Size of each avatar */
  size?: 'sm' | 'default' | 'lg'
  /** Show tooltips on hover */
  showTooltips?: boolean
}

const sizeClasses = {
  sm: 'h-7 w-7 text-[var(--space-3)]',
  default: 'h-9 w-9 text-xs',
  lg: 'h-11 w-11 text-sm',
}

const overlapClasses = {
  sm: '-ml-2',
  default: '-ml-3',
  lg: '-ml-3.5',
}

function AvatarGroup({
  items,
  max = 5,
  size = 'default',
  showTooltips = true,
  className,
  ...props
}: AvatarGroupProps) {
  const visible = items.slice(0, max)
  const overflowCount = items.length - max

  const avatarSize = sizeClasses[size]
  const overlap = overlapClasses[size]

  const renderAvatar = (item: AvatarGroupItem, index: number) => {
    const initials = item.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    const avatar = (
      <Avatar
        key={index}
        className={cn(
          avatarSize,
          index > 0 && overlap,
          'ring-2 ring-background transition-transform duration-[var(--motion-fast)] ease-[var(--motion-ease-default)] hover:z-10 hover:scale-110',
        )}
      >
        {item.src && <AvatarImage src={item.src} alt={item.name} />}
        <AvatarFallback className={cn('font-semibold bg-muted text-muted-foreground', avatarSize)}>
          {initials}
        </AvatarFallback>
      </Avatar>
    )

    if (showTooltips) {
      return (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <span className="cursor-default">{avatar}</span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs font-medium">
            {item.name}
          </TooltipContent>
        </Tooltip>
      )
    }
    return avatar
  }

  const content = (
    <div className={cn('flex items-center', className)} {...props}>
      {visible.map((item, i) => renderAvatar(item, i))}
      {overflowCount > 0 && (
        <div
          className={cn(
            avatarSize,
            overlap,
            'relative flex items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold ring-2 ring-background transition-transform duration-[var(--motion-fast)] hover:scale-110',
          )}
          aria-label={`${String(overflowCount)} more`}
        >
          +{overflowCount}
        </div>
      )}
    </div>
  )

  if (showTooltips) {
    return <TooltipProvider delayDuration={200}>{content}</TooltipProvider>
  }

  return content
}

export { AvatarGroup }
