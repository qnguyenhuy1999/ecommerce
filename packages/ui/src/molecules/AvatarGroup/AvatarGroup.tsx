'use client'

import React from 'react'

import { Avatar, AvatarImage, AvatarFallback } from '../../atoms/Avatar/Avatar'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '../../atoms/Tooltip/Tooltip'
import { createStrictContext } from '../../lib/createStrictContext'
import { cn } from '../../lib/utils'

// Data shape kept for backwards compatibility when callers supply `items`.
export interface AvatarGroupItem {
  name: string
  src?: string
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional array of avatar data (legacy) */
  items?: AvatarGroupItem[]
  /** Maximum number of avatars to display before the "+N" overflow */
  max?: number
  /** Size of each avatar */
  size?: 'sm' | 'default' | 'lg'
  /** Show tooltips on hover */
  showTooltips?: boolean
  children?: React.ReactNode
}

const sizeClasses = {
  sm: 'h-7 w-7 text-[var(--space-3)]',
  default: 'h-9 w-9 text-xs',
  lg: 'h-11 w-11 text-sm',
} as const

const overlapClasses = {
  sm: '-ml-2',
  default: '-ml-3',
  lg: '-ml-3.5',
} as const

type AvatarGroupContextValue = {
  avatarSize: string
  overlap: string
  showTooltips: boolean
}

const [AvatarGroupProvider, useAvatarGroup] = createStrictContext<AvatarGroupContextValue>('AvatarGroup')

// ─── Item subcomponent (public) ─────────────────────────────────────────────
export function AvatarGroupItemComponent({
  name,
  src,
  className,
  index = 0,
}: {
  name: string
  src?: string
  className?: string
  index?: number
}) {
  const { avatarSize, overlap, showTooltips } = useAvatarGroup()

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const avatar = (
    <Avatar
      className={cn(
        avatarSize,
        index > 0 && overlap,
        'ring-2 ring-background transition-transform duration-[var(--motion-fast)] ease-[var(--motion-ease-default)] hover:z-10 hover:scale-110',
        className,
      )}
    >
      {src && <AvatarImage src={src} alt={name} />}
      <AvatarFallback className={cn('font-semibold bg-muted text-muted-foreground', avatarSize)}>
        {initials}
      </AvatarFallback>
    </Avatar>
  )

  if (showTooltips) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-default">{avatar}</span>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs font-medium">
          {name}
        </TooltipContent>
      </Tooltip>
    )
  }

  return avatar
}
AvatarGroupItemComponent.displayName = 'AvatarGroup.Item'

// ─── Overflow subcomponent (public) ─────────────────────────────────────────
export function AvatarGroupOverflow({
  count,
  children,
  className,
}: {
  count?: number
  children?: React.ReactNode
  className?: string
}) {
  const { avatarSize, overlap } = useAvatarGroup()

  return (
    <div
      className={cn(
        avatarSize,
        overlap,
        'relative flex items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold ring-2 ring-background transition-transform duration-[var(--motion-fast)] hover:scale-110',
        className,
      )}
      aria-label={count ? `${String(count)} more` : undefined}
    >
      {children ?? (count ? `+${String(count)}` : null)}
    </div>
  )
}
AvatarGroupOverflow.displayName = 'AvatarGroup.Overflow'

// ─── Root component (supports legacy `items` array OR children composition) ──
function AvatarGroupRoot({
  items,
  max = 5,
  size = 'default',
  showTooltips = true,
  className,
  children,
  ...props
}: AvatarGroupProps) {
  const avatarSize = sizeClasses[size]
  const overlap = overlapClasses[size]

  // Normalize children and items into an array we can slice for `max`
  const childArray = React.Children.toArray(children)
  const totalCount = items ? items.length : childArray.length
  const overflowCount = Math.max(0, totalCount - max)

  const providerValue = React.useMemo(
    () => ({ avatarSize, overlap, showTooltips }),
    [avatarSize, overlap, showTooltips],
  )

  const content = (
    <div className={cn('flex items-center', className)} {...props}>
      {items
        ? items
            .slice(0, max)
            .map((it, i) => (
              <AvatarGroupItemComponent key={i} name={it.name} src={it.src} index={i} />
            ))
        : childArray.slice(0, max).map((child, i) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<{ index?: number }>, {
                key: i,
                index: i,
              })
            }
            return child
          })}

      {overflowCount > 0 && <AvatarGroupOverflow count={overflowCount} />}
    </div>
  )

  return (
    <AvatarGroupProvider value={providerValue}>
      {showTooltips ? <TooltipProvider delayDuration={200}>{content}</TooltipProvider> : content}
    </AvatarGroupProvider>
  )
}

const AvatarGroup = Object.assign(AvatarGroupRoot, {
  Item: AvatarGroupItemComponent,
  Overflow: AvatarGroupOverflow,
})

export { AvatarGroup }
