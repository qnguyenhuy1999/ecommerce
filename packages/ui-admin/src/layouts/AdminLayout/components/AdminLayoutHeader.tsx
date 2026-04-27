'use client'

import React from 'react'

import { AdminHeader, type AdminHeaderProps } from '../../../organisms/AdminHeader/AdminHeader'

/**
 * AdminLayoutHeader — Header zone for AdminLayout.
 *
 * Layer: Template section
 * RSC: No — requires 'use client'
 * Props: Either render `children` directly or configure the default `AdminHeader`.
 */
export interface AdminLayoutHeaderProps extends AdminHeaderProps {
  children?: React.ReactNode
}

export function AdminLayoutHeader({ children, ...props }: AdminLayoutHeaderProps) {
  if (children) return <>{children}</>
  return <AdminHeader aria-label="Admin header" {...props} />
}

AdminLayoutHeader.displayName = 'AdminLayout.Header'

