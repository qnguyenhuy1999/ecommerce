import type * as React from 'react'

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
}

export interface HeaderUserMenuProps {
  userName?: string
  userEmail?: string
  onSignOut?: () => void
  className?: string
}
