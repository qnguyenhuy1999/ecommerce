'use client'

import React from 'react'

import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from '../../lib/utils'

type TabsVariant = 'default' | 'underline' | 'pills' | 'enclosed'

const TabsContext = React.createContext<{ variant: TabsVariant }>({ variant: 'default' })

const Tabs = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & { variant?: TabsVariant }
>(({ variant = 'default', ...props }, ref) => (
  <TabsContext.Provider value={{ variant }}>
    <TabsPrimitive.Root ref={ref} {...props} />
  </TabsContext.Provider>
))
Tabs.displayName = TabsPrimitive.Root.displayName

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const { variant } = React.useContext(TabsContext)

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center text-muted-foreground',
        variant === 'default' && 'h-10 rounded-[var(--radius-sm)] bg-muted p-1',
        variant === 'underline' &&
          'h-12 w-full justify-start border-b border-border bg-transparent p-0',
        variant === 'pills' && 'gap-2',
        variant === 'enclosed' &&
          'h-12 w-full justify-start rounded-t-[var(--radius-lg)] border-b border-border bg-muted/50 px-2 pt-2',
        className,
      )}
      {...props}
    />
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const { variant } = React.useContext(TabsContext)

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium',
        'ring-offset-background transition-all duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',

        variant === 'default' &&
          'rounded-[var(--radius-sm)] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-[var(--elevation-card)]',

        variant === 'underline' &&
          'relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground hover:text-foreground data-[state=active]:border-brand data-[state=active]:text-foreground data-[state=active]:shadow-none',

        variant === 'pills' &&
          'rounded-full border border-transparent data-[state=active]:border-border data-[state=active]:bg-foreground data-[state=active]:text-background',

        variant === 'enclosed' &&
          'relative h-10 rounded-t-[var(--radius-md)] border border-transparent bg-transparent px-4 py-2 font-semibold hover:bg-muted data-[state=active]:border-border data-[state=active]:border-b-background data-[state=active]:bg-background data-[state=active]:text-foreground',
        className,
      )}
      {...props}
    />
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-3 ring-offset-background',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:zoom-out-95',
      'data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95',
      'duration-[var(--motion-normal)]',
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
