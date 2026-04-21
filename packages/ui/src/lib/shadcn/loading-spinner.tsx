import React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../lib/utils'

const spinnerCva = cva([], {
  variants: {
    variant: {
      /** Brand-coloured arc — great on light backgrounds */
      brand: [
        '[&_.spinner-track]:stroke-[var(--surface-muted)]',
        '[&_.spinner-arc]:stroke-[var(--color-brand)]',
        '[&_.spinner-glow]:fill-[var(--color-brand)]',
      ].join(' '),
      /** White arc — for use on dark / brand-tinted backgrounds */
      white: [
        '[&_.spinner-track]:stroke-white/20',
        '[&_.spinner-arc]:stroke-white',
        '[&_.spinner-glow]:fill-white',
      ].join(' '),
      /** Neutral muted arc — minimal UI contexts */
      neutral: [
        '[&_.spinner-track]:stroke-[var(--surface-muted)]',
        '[&_.spinner-arc]:stroke-[var(--text-tertiary)]',
        '[&_.spinner-glow]:fill-[var(--text-tertiary)]',
      ].join(' '),
    },
    size: {
      xs: 'h-[var(--space-4)] w-[var(--space-4)]',
      sm: 'h-[var(--space-5)] w-[var(--space-5)]',
      default: 'h-[var(--space-6)] w-[var(--space-6)]',
      lg: 'h-[var(--space-8)] w-[var(--space-8)]',
      xl: 'h-[var(--space-10)] w-[var(--space-10)]',
    },
  },
  defaultVariants: {
    variant: 'brand',
    size: 'default',
  },
})

interface LoadingSpinnerProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, 'children'>, VariantProps<typeof spinnerCva> {
  /** Screen-reader label. Defaults to "Loading". */
  label?: string
}

const LoadingSpinner = React.forwardRef<SVGSVGElement, LoadingSpinnerProps>(
  ({ variant, size, label = 'Loading', className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        className={cn(
          spinnerCva({ variant, size }),
          'animate-[spin_var(--motion-slow,0.7s)_linear_infinite]',
          className,
        )}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="status"
        aria-label={label}
        {...props}
      >
        {/* ── Track (background ring) ── */}
        <circle className="spinner-track" cx="12" cy="12" r="9" strokeWidth="2" />

        {/* ── Arc (spinning 270° segment) ── */}
        <path
          className="spinner-arc"
          d="M12 3a9 9 0 0 1 9 9"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* ── Glow dot at arc tip ── */}
        <circle className="spinner-glow" cx="21" cy="12" r="1.5" />
      </svg>
    )
  },
)
LoadingSpinner.displayName = 'LoadingSpinner'

export { spinnerCva, LoadingSpinner }
export type { LoadingSpinnerProps }
