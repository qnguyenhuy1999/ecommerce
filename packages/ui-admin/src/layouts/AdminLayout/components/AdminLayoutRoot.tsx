'use client'

import React from 'react'

import { cn } from '@ecom/ui/utils'

import { AdminLayoutProvider } from '../context/AdminLayoutContext'
import { AdminHeader } from '../../../organisms/AdminHeader/AdminHeader'
import { AdminSidebar } from '../../../organisms/Sidebar/AdminSidebar'
import { AdminLayoutContentHeader } from './AdminLayoutContentHeader'
import { AdminLayoutHeader } from './AdminLayoutHeader'
import { AdminLayoutMain } from './AdminLayoutMain'
import { AdminLayoutSidebar } from './AdminLayoutSidebar'
import { AdminLayoutTopbar } from './AdminLayoutTopbar'

/**
 * AdminLayoutRoot — Page-level admin shell layout with optional chrome zones.
 *
 * Layer: Template
 * RSC: No — requires 'use client'
 * Props: Root container props + sidebar collapse defaults/callback.
 */
export interface AdminLayoutRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  defaultSidebarCollapsed?: boolean
  onSidebarCollapseChange?: (collapsed: boolean) => void

  /**
   * Back-compat slots — prefer compound zones:
   * `<AdminLayout.Sidebar />`, `<AdminLayout.Header />`, `<AdminLayout.Topbar />`,
   * `<AdminLayout.ContentHeader />`, `<AdminLayout.Main />`.
   */
  sidebar?: React.ReactNode | false
  header?: React.ReactNode | false
  shellTopbar?: React.ReactNode
  contentHeader?: React.ReactNode
  currentPath?: string
  onNavigate?: (href: string) => void
  sidebarProps?: Omit<
    React.ComponentProps<typeof AdminSidebar>,
    'collapsed' | 'onToggleCollapse'
  >
  headerProps?: React.ComponentProps<typeof AdminHeader>
}

export function AdminLayoutRoot({
  children,
  className,
  defaultSidebarCollapsed = false,
  onSidebarCollapseChange,
  sidebar,
  header,
  shellTopbar,
  contentHeader,
  currentPath,
  onNavigate,
  sidebarProps,
  headerProps,
  ...props
}: AdminLayoutRootProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(defaultSidebarCollapsed)

  const toggleSidebar = React.useCallback(() => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev
      onSidebarCollapseChange?.(next)
      return next
    })
  }, [onSidebarCollapseChange])

  const childArray = React.useMemo(() => React.Children.toArray(children), [children])

  const sidebarChild = childArray.find(
    (c) => React.isValidElement(c) && (c.type as React.ComponentType<unknown>) === AdminLayoutSidebar,
  ) as React.ReactElement<React.ComponentProps<typeof AdminLayoutSidebar>> | undefined

  const topbarChild = childArray.find(
    (c) => React.isValidElement(c) && (c.type as React.ComponentType<unknown>) === AdminLayoutTopbar,
  ) as React.ReactElement<React.ComponentProps<typeof AdminLayoutTopbar>> | undefined

  const headerChild = childArray.find(
    (c) => React.isValidElement(c) && (c.type as React.ComponentType<unknown>) === AdminLayoutHeader,
  ) as React.ReactElement<React.ComponentProps<typeof AdminLayoutHeader>> | undefined

  const contentHeaderChild = childArray.find(
    (c) =>
      React.isValidElement(c) &&
      (c.type as React.ComponentType<unknown>) === AdminLayoutContentHeader,
  ) as React.ReactElement<React.ComponentProps<typeof AdminLayoutContentHeader>> | undefined

  const mainChild = childArray.find(
    (c) => React.isValidElement(c) && (c.type as React.ComponentType<unknown>) === AdminLayoutMain,
  ) as React.ReactElement<React.ComponentProps<typeof AdminLayoutMain>> | undefined

  const remaining = childArray.filter((c) => {
    if (!React.isValidElement(c)) return true
    const t = c.type as React.ComponentType<unknown>
    return (
      t !== AdminLayoutSidebar &&
      t !== AdminLayoutTopbar &&
      t !== AdminLayoutHeader &&
      t !== AdminLayoutContentHeader &&
      t !== AdminLayoutMain
    )
  })

  const resolvedSidebar =
    sidebarChild ??
    (sidebar === false
      ? undefined
      : sidebar ?? (
          <AdminLayoutSidebar currentPath={currentPath} onNavigate={onNavigate} {...sidebarProps} />
        ))

  const resolvedTopbar = topbarChild ?? (shellTopbar ? <AdminLayoutTopbar>{shellTopbar}</AdminLayoutTopbar> : undefined)

  const resolvedHeader =
    headerChild ??
    (header === false
      ? undefined
      : header ?? (headerProps ? (
          <AdminLayoutHeader
            className={cn(
              'border-b border-[var(--border-subtle)] bg-[var(--surface-base)]',
              headerProps.className,
            )}
            {...headerProps}
          />
        ) : undefined))

  const resolvedContentHeader = contentHeaderChild ?? (contentHeader ? <AdminLayoutContentHeader>{contentHeader}</AdminLayoutContentHeader> : undefined)

  const resolvedMain = mainChild
    ? React.cloneElement(mainChild, {
        children: (
          <>
            {resolvedContentHeader}
            {mainChild.props.children}
          </>
        ),
      })
    : (
        <AdminLayoutMain>
          {resolvedContentHeader}
          {remaining}
        </AdminLayoutMain>
      )

  return (
    <AdminLayoutProvider value={{ isSidebarCollapsed, toggleSidebar }}>
      <div
        aria-label="Admin layout"
        className={cn(
          'min-h-screen bg-[var(--surface-subtle)] text-foreground antialiased',
          className,
        )}
        {...props}
      >
        {resolvedSidebar}

        <div
          className={cn(
            'flex min-h-screen min-w-0 flex-1 flex-col',
            'transition-[padding-left] duration-[var(--duration-normal)] ease-[var(--motion-ease-default)]',
            isSidebarCollapsed
              ? 'lg:pl-[var(--admin-sidebar-collapsed-width)]'
              : 'lg:pl-[var(--admin-sidebar-width)]',
          )}
        >
          {resolvedTopbar}
          {resolvedHeader}
          {resolvedMain}
        </div>
      </div>
    </AdminLayoutProvider>
  )
}

AdminLayoutRoot.displayName = 'AdminLayout'
