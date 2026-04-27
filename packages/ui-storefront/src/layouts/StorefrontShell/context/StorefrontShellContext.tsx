'use client'

import React from 'react'

export interface StorefrontShellContextValue {
  stickyHeader: boolean
  blurHeaderOnScroll: boolean
  scrolled: boolean
  headerRef: React.MutableRefObject<HTMLElement | null>
}

const StorefrontShellContext = React.createContext<StorefrontShellContextValue | null>(null)

export function useStorefrontShellContext() {
  const value = React.useContext(StorefrontShellContext)
  if (!value) throw new Error('useStorefrontShellContext must be used within <StorefrontShell>.')
  return value
}

export function StorefrontShellProvider({
  value,
  children,
}: {
  value: StorefrontShellContextValue
  children: React.ReactNode
}) {
  return <StorefrontShellContext.Provider value={value}>{children}</StorefrontShellContext.Provider>
}

