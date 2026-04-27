'use client'

import React from 'react'

export interface AdminLayoutContextValue {
  isSidebarCollapsed: boolean
  toggleSidebar: () => void
}

const AdminLayoutContext = React.createContext<AdminLayoutContextValue | null>(null)

export function useAdminLayoutContext() {
  const value = React.useContext(AdminLayoutContext)
  if (!value) throw new Error('useAdminLayoutContext must be used within <AdminLayout>.')
  return value
}

export function AdminLayoutProvider({
  value,
  children,
}: {
  value: AdminLayoutContextValue
  children: React.ReactNode
}) {
  return <AdminLayoutContext.Provider value={value}>{children}</AdminLayoutContext.Provider>
}

