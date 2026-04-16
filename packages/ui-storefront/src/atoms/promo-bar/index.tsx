import React from 'react'

import { X } from 'lucide-react'

import { cn, IconButton } from '@ecom/ui'

export interface PromoBarProps extends React.HTMLAttributes<HTMLDivElement> {
  message: React.ReactNode
  link?: string
  dismissible?: boolean
  variant?: 'brand' | 'info' | 'success' | 'dark'
}

function PromoBar({
  message,
  link,
  dismissible = false,
  variant = 'brand',
  className,
  ...props
}: PromoBarProps) {
  const [isVisible, setIsVisible] = React.useState(true)

  if (!isVisible) return null

  const content = <div className="flex-1 text-center truncate px-4">{message}</div>

  const variantClass = {
    brand: 'promo-bar--brand',
    info: 'promo-bar--info',
    success: 'promo-bar--success',
    dark: 'bg-foreground text-background font-semibold text-sm py-2 text-center',
  }[variant]

  return (
    <div
      className={cn(
        'promo-bar relative flex items-center justify-center w-full min-h-[36px]',
        variantClass,
        className,
      )}
      {...props}
    >
      {link ? (
        <a
          href={link}
          className="absolute inset-0 z-0 flex items-center justify-center hover:underline underline-offset-4 decoration-current/50"
        >
          <span className="sr-only">Promo link</span>
        </a>
      ) : null}

      <div className="relative z-10 flex items-center w-full max-w-7xl mx-auto px-4">
        <div className="w-6 shrink-0" /> {/* Spacer for centered text */}
        {content}
        <div className="w-6 shrink-0 flex justify-end">
          {dismissible && (
            <IconButton
              icon={<X className="w-4 h-4" />}
              label="Dismiss promo"
              variant="ghost"
              className="p-1 rounded-full"
              onClick={() => {
                setIsVisible(false)
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export { PromoBar }
