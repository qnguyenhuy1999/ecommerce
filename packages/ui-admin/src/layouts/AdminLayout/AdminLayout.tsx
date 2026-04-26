'use client'

import React, { useState } from 'react'

import { cn } from '@ecom/ui'

import type { AdminSidebarProps } from '../../organisms/Sidebar/AdminSidebar'
import type { AdminHeaderProps } from '../../organisms/AdminHeader/AdminHeader'
import { AdminSidebar } from '../../organisms/Sidebar/AdminSidebar'
import { AdminHeader } from '../../organisms/AdminHeader/AdminHeader'

interface AdminLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar?: React.ReactNode
  header?: React.ReactNode
  children: React.ReactNode
  currentPath?: string
  onNavigate?: (href: string) => void
  sidebarProps?: Partial<AdminSidebarProps>
  headerProps?: Partial<AdminHeaderProps>
  shellTopbar?: React.ReactNode
  contentHeader?: React.ReactNode
  defaultSidebarCollapsed?: boolean
  onSidebarCollapseChange?: (collapsed: boolean) => void
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
  shellTopbar,
  contentHeader,
  defaultSidebarCollapsed = false,
  onSidebarCollapseChange,
  ...props
}: AdminLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(defaultSidebarCollapsed)

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev
      onSidebarCollapseChange?.(next)
      return next
    })
  }

  return (
    <div
      className={cn(
        'min-h-screen bg-[var(--surface-subtle)] text-foreground antialiased',
        className,
      )}
      {...props}
    >
      {sidebar !== false &&
        (sidebar ?? (
          <AdminSidebar
            currentPath={currentPath}
            onNavigate={onNavigate}
            collapsed={isSidebarCollapsed}
            onToggleCollapse={handleToggleSidebar}
            {...sidebarProps}
          />
        ))}

      <div
        className={cn(
          'flex min-h-screen min-w-0 flex-1 flex-col',
          'transition-[padding-left] duration-[var(--duration-normal)] ease-[var(--motion-ease-default)]',
          isSidebarCollapsed
            ? 'lg:pl-[var(--admin-sidebar-collapsed-width)]'
            : 'lg:pl-[var(--admin-sidebar-width)]',
        )}
      >
        {shellTopbar}

        {header !== false &&
          (header ?? (
            <AdminHeader
              className="border-b border-[var(--border-subtle)] bg-[var(--surface-base)]"
              {...headerProps}
            />
          ))}

        <main className="relative flex-1">
          <div
            className={cn(
              'mx-auto flex w-full max-w-[var(--admin-content-max-width)] flex-1 flex-col',
              'gap-[var(--space-6)]',
              'px-[var(--space-4)] sm:px-[var(--space-6)] lg:px-[var(--space-8)]',
              'pt-[var(--space-6)] pb-[var(--space-10)]',
              'animate-in fade-in slide-in-from-bottom-2 duration-[var(--duration-normal)] fill-mode-both',
            )}
          >
            {contentHeader}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export { AdminLayout }
export type { AdminLayoutProps }
