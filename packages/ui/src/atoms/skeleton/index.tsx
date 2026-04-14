import React from 'react'

import { cn } from '../../lib/utils'

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-[8px] bg-muted',
        'animate-[shimmer_2s_infinite_linear]',
        'bg-[length:200%_100%]',
        'bg-gradient-to-r from-muted via-muted/60 to-muted',
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
