'use client'

import React from 'react'

import { cn } from '@ecom/ui'

import type { AdminSidebarProps } from '../../organisms/Sidebar/AdminSidebar'
import type { AdminHeaderProps } from '../../organisms/AdminHeader/Header'
import { AdminSidebar } from '../../organisms/Sidebar/AdminSidebar'
import { AdminHeader } from '../../organisms/AdminHeader/Header'

interface AdminLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Custom sidebar to render. */
  sidebar?: React.ReactNode
  /** Custom header to render. */
  header?: React.ReactNode
  /** Child page content rendered inside the main content area. */
  children: React.ReactNode
  /** Current pathname for active nav highlighting. */
  currentPath?: string
  /** Callback fired when a sidebar nav item with an href is clicked. */
  onNavigate?: (href: string) => void
  /** Props forwarded directly to the default `AdminSidebar`. */
  sidebarProps?: Partial<AdminSidebarProps>
  /** Props forwarded directly to the default `AdminHeader`. */
  headerProps?: Partial<AdminHeaderProps>
}

function AdminLayout({
  sidebar,
  header,
  children,
  currentPath,
  onNavigate,
  sidebarProps,
  headerProps,
  className,
  ...props
}: AdminLayoutProps) {
  return (
    <div
      className={cn(
        'min-h-screen bg-[var(--surface-subtle)] text-foreground flex flex-col',
        className,
      )}
      {...props}
    >
      {/* Sidebar */}
      {sidebar !== false &&
        (sidebar ?? (
          <AdminSidebar currentPath={currentPath} onNavigate={onNavigate} {...sidebarProps} />
        ))}

      {/* Main Column */}
      <div className="flex flex-1 flex-col min-w-0 lg:pl-64 transition-all duration-[var(--duration-normal)]">
        {/* Header - Transparent and floating above content per design */}
        {header !== false && (header ?? <AdminHeader {...headerProps} />)}

        {/* Content Area */}
        <main className="relative flex-1">
          <div className="px-6 pb-8 w-full max-w-[var(--container-2xl)] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-[var(--duration-normal)] fill-mode-both">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export { AdminLayout }
export type { AdminLayoutProps }
