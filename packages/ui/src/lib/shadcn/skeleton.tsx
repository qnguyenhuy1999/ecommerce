'use client'

import React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../lib/utils'

const skeletonVariants = cva(
  [
    'bg-[length:200%_100%] bg-gradient-to-r from-[var(--surface-muted)] via-[var(--surface-subtle)] to-[var(--surface-muted)]',
    'shadow-[inset_0_1px_0_rgb(255_255_255_/_0.2)]',
    'motion-safe:animate-[shimmer_var(--animate-duration-shimmer-skeleton)_linear_infinite]',
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
