import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import type { ElementType } from 'react'

import type { PolymorphicComponentProps, PolymorphicPropsWithChildren } from '../../lib/polymorphic'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3.5',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a]:hover:bg-primary/80',
        secondary: 'bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80',
        destructive:
          'bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20',
        outline: 'border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground',
        ghost: 'hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      tone: {
        default: '',
        neutral: 'bg-muted text-muted-foreground',
        info: 'bg-info/10 text-info',
        success: 'bg-success/10 text-success',
        warning: 'bg-warning/10 text-warning',
        destructive: 'bg-destructive/10 text-destructive',
        pending: 'bg-muted text-muted-foreground',
        reported: 'bg-warning/10 text-warning',
        approved: 'bg-success/10 text-success',
        rejected: 'bg-destructive/10 text-destructive',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'h-6 px-2.5 text-sm',
        lg: 'h-7 px-3 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      tone: 'default',
      size: 'default',
    },
  },
)

type BadgeProps<TElement extends ElementType = 'span'> = PolymorphicComponentProps<
  TElement,
  PolymorphicPropsWithChildren &
    VariantProps<typeof badgeVariants> & {
      asChild?: boolean
    }
>

function Badge<TElement extends ElementType = 'span'>({
  className,
  variant = 'default',
  tone = 'default',
  size = 'default',
  asChild = false,
  ...props
}: BadgeProps<TElement>) {
  const Comp = (asChild ? Slot.Root : 'span') as ElementType

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      className={cn(badgeVariants({ variant, tone, size }), className)}
      {...props}
    />
  )
}

export { Badge }
export type { BadgeProps }
