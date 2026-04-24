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
        'min-h-screen bg-[radial-gradient(circle_at_top_right,rgb(var(--brand-500-rgb)_/_0.07),transparent_26%),var(--surface-subtle)] text-foreground',
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
          'flex min-h-screen flex-1 flex-col min-w-0 transition-all duration-[var(--duration-normal)]',
          isSidebarCollapsed ? 'pl-16' : 'pl-[var(--admin-sidebar-width)]',
        )}
      >
        {shellTopbar}

        {header !== false &&
          (header ?? (
            <AdminHeader
              className="border-b border-[var(--border-subtle)] bg-[var(--surface-base)]/92 backdrop-blur-[14px]"
              {...headerProps}
            />
          ))}

        <main className="relative flex-1">
          <div className="mx-auto flex w-full max-w-[calc(var(--admin-content-max-width)+var(--space-12))] flex-1 flex-col gap-6 px-[var(--space-6)] pb-[var(--space-8)] pt-[var(--space-6)] animate-in fade-in slide-in-from-bottom-2 duration-[var(--duration-normal)] fill-mode-both">
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
