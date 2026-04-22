import React from 'react'

import { cn } from '@ecom/ui'

import type { AdminSidebarProps } from '../../organisms/Sidebar/AdminSidebar'
import type { AdminHeaderProps } from '../../organisms/AdminHeader/AdminHeader'
import { AdminSidebar } from '../../organisms/Sidebar/AdminSidebar'
import { AdminHeader } from '../../organisms/AdminHeader/AdminHeader'

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
        'min-h-screen flex flex-col text-foreground bg-[var(--surface-subtle)]',
        className,
      )}
      {...props}
    >
      {/* Sidebar */}
      {sidebar !== false &&
        (sidebar ?? (
          <AdminSidebar currentPath={currentPath} onNavigate={onNavigate} {...sidebarProps} />
        ))}

      {/* Main Column — offset by sidebar width */}
      <div className="flex flex-1 flex-col min-w-0 pl-[var(--admin-sidebar-width)] transition-all duration-[var(--duration-normal)]">
        {/* Header */}
        {header !== false && (header ?? <AdminHeader {...headerProps} />)}

        {/* Content Area */}
        <main className="relative flex-1">
          <div className="w-full mx-auto p-[var(--space-6)] pb-[var(--space-8)] max-w-[var(--admin-content-max-width)] animate-in fade-in slide-in-from-bottom-2 duration-[var(--duration-normal)] fill-mode-both">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export { AdminLayout }
export type { AdminLayoutProps }
