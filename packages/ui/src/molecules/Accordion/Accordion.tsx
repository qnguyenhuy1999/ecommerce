'use client'

import * as React from 'react'

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cva, type VariantProps } from 'class-variance-authority'

import { ChevronDown } from 'lucide-react'

import { cn } from '../../lib/utils'

const Accordion = AccordionPrimitive.Root

const accordionItemVariants = cva('border-b border-border last:border-b-0', {
  variants: {
    variant: {
      default: '',
      ghost: 'border-0',
      card: 'mb-4 rounded-[var(--radius-lg)] border bg-card text-card-foreground shadow-[var(--elevation-card)] overflow-hidden last:mb-0',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

// Create a context so children know the variant
const AccordionItemContext = React.createContext<{ variant: 'default' | 'ghost' | 'card' }>({
  variant: 'default',
})

const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> &
    VariantProps<typeof accordionItemVariants>
>(({ className, variant = 'default', ...props }, ref) => {
  const resolvedVariant = (variant || 'default')
  return (
    <AccordionItemContext.Provider value={{ variant: resolvedVariant }}>
      <AccordionPrimitive.Item
        ref={ref}
        className={cn(accordionItemVariants({ variant }), className)}
        {...props}
      />
    </AccordionItemContext.Provider>
  )
})
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const { variant } = React.useContext(AccordionItemContext)

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          '[&[data-state=open]>svg]:rotate-180',
          variant === 'card' && 'px-4 hover:bg-muted/50 hover:no-underline',
          variant === 'ghost' &&
            'px-4 py-3 hover:bg-muted/50 hover:no-underline rounded-[var(--radius-sm)]',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-[var(--motion-normal)] ease-[var(--motion-ease-default)]" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
})
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const { variant } = React.useContext(AccordionItemContext)

  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        'overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
        'duration-[var(--motion-normal)] ease-[var(--motion-ease-out)]',
      )}
      {...props}
    >
      <div
        className={cn(
          'pb-4 pt-0',
          variant === 'card' && 'px-4',
          variant === 'ghost' && 'px-4',
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
})
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
