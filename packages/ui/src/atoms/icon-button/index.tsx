import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'
import { cn } from '../../lib/utils'

const iconButtonVariants = cva(
  [
    'inline-flex items-center justify-center rounded-[8px]',
    'transition-all duration-[150ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.95]',
    '[&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        brand: 'bg-brand text-brand-foreground shadow-sm hover:bg-brand-hover',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
      },
      size: {
        sm: 'h-7 w-7 [&_svg]:h-3.5 [&_svg]:w-3.5',
        default: 'h-9 w-9 [&_svg]:h-4 [&_svg]:w-4',
        lg: 'h-11 w-11 [&_svg]:h-5 [&_svg]:w-5',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'default',
    },
  },
)

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof iconButtonVariants> {
  icon: React.ReactNode
  label: string
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, variant, size, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-label={label}
        className={cn(iconButtonVariants({ variant, size, className }))}
        {...props}
      >
        {icon}
      </button>
    )
  },
)
IconButton.displayName = 'IconButton'

export { IconButton, iconButtonVariants }
export type { IconButtonProps }
