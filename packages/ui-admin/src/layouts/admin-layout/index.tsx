'use client'

import * as React from 'react'
import { cn } from '@ecom/ui'

interface AdminLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar?: React.ReactNode
  header?: React.ReactNode
  children: React.ReactNode
  sidebarWidth?: string
  headerHeight?: string
}

function AdminLayout({
  sidebar,
  header,
  children,
  sidebarWidth = '16rem',
  headerHeight = '3.5rem',
  className,
  ...props
}: AdminLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)} {...props}>
      {sidebar && (
        <div className="fixed top-0 left-0 h-screen shrink-0" style={{ width: sidebarWidth }}>
          {sidebar}
        </div>
      )}
      <div
        className="flex flex-col min-h-screen"
        style={{ marginLeft: sidebar ? sidebarWidth : 0 }}
      >
        {header && (
          <div
            className="fixed top-0 shrink-0 bg-background border-b z-10"
            style={{ left: sidebar ? sidebarWidth : 0, right: 0, height: headerHeight }}
          >
            {header}
          </div>
        )}
        <main className="flex-1" style={{ paddingTop: header ? headerHeight : 0 }}>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

export { AdminLayout }
export type { AdminLayoutProps }
