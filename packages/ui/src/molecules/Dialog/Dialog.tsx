'use client'

import React from 'react'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cva, type VariantProps } from 'class-variance-authority'

import { X } from 'lucide-react'

import { cn } from '../../lib/utils'

const Root = DialogPrimitive.Root
const Portal = DialogPrimitive.Portal
const Overlay = DialogPrimitive.Overlay
const Trigger = DialogPrimitive.Trigger
const Close = DialogPrimitive.Close

const dialogContentVariants = cva(
  [
    'fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%]',
    'border bg-background',
    'shadow-[var(--elevation-modal)]',
    'rounded-[var(--radius-lg)] p-6',
    'duration-[var(--motion-normal)] ease-[var(--motion-ease-out)]',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
    'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[calc(50%-24px)]',
    'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[calc(50%-24px)]',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        default: 'max-w-lg',
        lg: 'max-w-xl',
        xl: 'max-w-3xl',
        fullscreen: 'max-w-[100vw] h-[100vh] rounded-none border-0',
      },
      variant: {
        default: '',
        destructive: 'border-t-4 border-t-destructive',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  },
)

export interface DialogContentProps
  extends
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {}

const Content = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, size, variant, children, ...props }, ref) => {
  return (
    <Portal>
      <Overlay
        className={cn(
          'fixed inset-0 z-50',
          'bg-[var(--overlay-dialog)] backdrop-blur-[var(--overlay-dialog-blur)]',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        )}
      />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(dialogContentVariants({ size, variant }), className)}
        {...props}
      >
        {children}
        <Close
          className={cn(
            'absolute right-4 top-4 p-1.5',
            'rounded-[var(--radius-sm)]',
            'opacity-60 transition-colors duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
            'hover:opacity-100 hover:bg-[var(--overlay-hover-light)] dark:hover:bg-[var(--overlay-hover-dark)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:pointer-events-none cursor-pointer',
          )}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Close>
      </DialogPrimitive.Content>
    </Portal>
  )
})
Content.displayName = DialogPrimitive.Content.displayName

const Header = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
)
Header.displayName = 'DialogHeader'

const Footer = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-3', className)}
    {...props}
  />
)
Footer.displayName = 'DialogFooter'

const Title = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-xl font-semibold leading-[1.18] tracking-tight', className)}
    {...props}
  />
))
Title.displayName = DialogPrimitive.Title.displayName

const Description = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground leading-relaxed', className)}
    {...props}
  />
))
Description.displayName = DialogPrimitive.Description.displayName

export {
  Root as Dialog,
  Close as DialogClose,
  Content as DialogContent,
  Description as DialogDescription,
  Footer as DialogFooter,
  Header as DialogHeader,
  Overlay as DialogOverlay,
  Portal as DialogPortal,
  Title as DialogTitle,
  Trigger as DialogTrigger,
}
