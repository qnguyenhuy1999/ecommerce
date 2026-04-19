'use client'

import React from 'react'

import { Check } from 'lucide-react'

import { cn } from '@ecom/ui'

export interface CheckoutStep {
  id: string
  label: string
}

export interface CheckoutStepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: CheckoutStep[]
  currentStepId: string
}

function CheckoutStepper({ steps, currentStepId, className, ...props }: CheckoutStepperProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStepId)

  return (
    <div className={cn('w-full', className)} {...props}>
      <div className="flex items-center justify-between relative">
        {/* Background Track */}
        <div className="absolute left-0 top-4 -translate-y-1/2 w-full h-px bg-border" />

        {/* Progress Track */}
        <div
          className="absolute left-0 top-4 -translate-y-1/2 h-px bg-brand transition-all duration-[var(--motion-slow)] ease-[var(--motion-ease-in-out)]"
          style={{ width: `calc(${(currentIndex / (steps.length - 1)) * 100}% * var(--checkout-stepper-progress-scale, 1))` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isPending = index > currentIndex

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center gap-2.5"
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-sm)] font-bold',
                  'transition-all duration-[var(--motion-normal)] ease-[var(--motion-ease-bounce)]',
                  isCompleted && 'bg-brand text-brand-foreground shadow-sm',
                  isCurrent && [
                    'bg-brand text-brand-foreground',
                    'ring-4 ring-brand/20 shadow-[0_0_0_1px_var(--color-brand)]',
                    'animate-[var(--animate-step-pulse)]',
                  ],
                  isPending && 'bg-background text-muted-foreground border-2 border-border',
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 animate-in zoom-in duration-[var(--motion-fast)]" />
                ) : (
                  <span className={cn(isCurrent && 'scale-110 transition-transform')}>{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-semibold transition-colors duration-[var(--motion-normal)]',
                  'hidden sm:block whitespace-nowrap',
                  isCurrent && 'text-foreground',
                  isCompleted && 'text-muted-foreground',
                  isPending && 'text-muted-foreground/50',
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { CheckoutStepper }
