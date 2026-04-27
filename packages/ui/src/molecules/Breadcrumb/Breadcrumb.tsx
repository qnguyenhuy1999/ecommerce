'use client'

import React from 'react'

import { BreadcrumbView } from '../../atoms/Breadcrumb/Breadcrumb'
import type { BreadcrumbProps, BreadcrumbItem } from '../../atoms/Breadcrumb/Breadcrumb'

function Breadcrumb({
  items,
  separator,
  collapsible = false,
  className,
  ...props
}: BreadcrumbProps) {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <BreadcrumbView
      items={items}
      separator={separator}
      collapsible={collapsible}
      expanded={expanded}
      onExpand={() => {
        setExpanded(true)
      }}
      className={className}
      {...props}
    />
  )
}

export { Breadcrumb }
export type { BreadcrumbProps, BreadcrumbItem }
