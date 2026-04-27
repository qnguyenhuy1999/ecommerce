import React from 'react'

import { cn } from '@ecom/ui'

type PageContainerPadding = 'none' | 'compact' | 'default' | 'comfortable'

const VERTICAL_PADDING: Record<PageContainerPadding, string> = {
  none: '',
  compact: 'py-6 lg:py-8',
  default: 'py-8 lg:py-12',
  comfortable: 'py-12 lg:py-16',
}

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: PageContainerPadding
  bleed?: boolean
  as?: 'div' | 'section' | 'main' | 'article'
}

function PageContainer({
  padding = 'default',
  bleed = false,
  as: Tag = 'div',
  className,
  children,
  ...props
}: PageContainerProps) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full max-w-[var(--storefront-content-max-width)]',
        !bleed && 'px-4 sm:px-6 lg:px-8',
        VERTICAL_PADDING[padding],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export { PageContainer }
