'use client'

import React from 'react'

import * as AvatarPrimitive from '@radix-ui/react-avatar'

import { cn } from '../../lib/utils'

const sizeMap = {
  sm: 'h-8 w-8',
  default: 'h-10 w-10',
  lg: 'h-14 w-14',
}

export type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: 'sm' | 'default' | 'lg'
}

const Avatar = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & { size?: 'sm' | 'default' | 'lg' }
>(({ size = 'default', className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn('relative flex shrink-0 overflow-hidden rounded-full', sizeMap[size], className)}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

export type AvatarImageProps = React.ComponentProps<typeof AvatarPrimitive.Image>
const AvatarImage = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

export type AvatarFallbackProps = React.ComponentProps<typeof AvatarPrimitive.Fallback>
const AvatarFallback = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className,
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
