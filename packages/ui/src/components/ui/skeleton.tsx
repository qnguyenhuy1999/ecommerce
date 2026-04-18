'use client'

import React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../lib/utils'

const skeletonVariants = cva(
  [
    'bg-muted bg-[length:200%_100%] bg-gradient-to-r from-muted via-muted/60 to-muted',
    'motion-safe:animate-[shimmer_2s]',
  ].join(' '),
  {
    variants: {
      variant: {
        text: 'rounded-[var(--radius-sm)] h-4 w-full',
        circular: 'rounded-full h-10 w-10 shrink-0',
        rectangular: 'rounded-[var(--radius-sm)]',
        card: 'rounded-[var(--radius-lg)]',
      },
    },
    defaultVariants: {
      variant: 'rectangular',
    },
  },
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof skeletonVariants> {}

function Skeleton({ className, variant, ...props }: SkeletonProps) {
  return <div className={cn(skeletonVariants({ variant }), className)} {...props} />
}

export { Skeleton }
