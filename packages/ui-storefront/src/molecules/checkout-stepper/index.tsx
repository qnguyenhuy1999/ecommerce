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
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-border/50" />

        {/* Progress Track */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-brand transition-all duration-[var(--motion-normal)] ease-[var(--motion-ease-in-out)]"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isPending = index > currentIndex

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center gap-2 bg-background px-2"
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-sm)] font-bold transition-all duration-[var(--motion-normal)]',
                  isCompleted && 'bg-brand text-brand-foreground',
                  isCurrent &&
                    'bg-brand text-brand-foreground shadow-[0_0_0_4px_var(--color-brand-muted)]',
                  isPending && 'bg-muted text-muted-foreground border-2 border-border',
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 animate-in zoom-in duration-[var(--motion-fast)]" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  'text-[var(--text-xs)] font-semibold transition-colors duration-[var(--motion-normal)] hidden sm:block',
                  isCurrent || isCompleted ? 'text-foreground' : 'text-muted-foreground',
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
