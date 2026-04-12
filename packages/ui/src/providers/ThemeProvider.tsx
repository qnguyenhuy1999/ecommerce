'use client'

import React from 'react'

type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const STORAGE_KEY = 'ecom-theme'

const ThemeContext = React.createContext<ThemeContextValue>({
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
})

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>('light')

  // Resolve system preference
  const getSystemTheme = React.useCallback((): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }, [])

  // Apply theme to DOM
  const applyTheme = React.useCallback((resolved: ResolvedTheme) => {
    const root = document.documentElement
    if (resolved === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    root.setAttribute('data-theme', resolved)
    setResolvedTheme(resolved)
  }, [])

  // Initialize on mount
  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    const initial = stored ?? 'system'
    setThemeState(initial)

    const resolved = initial === 'system' ? getSystemTheme() : initial
    applyTheme(resolved)
  }, [applyTheme, getSystemTheme])

  // Listen for system preference changes when theme is 'system'
  React.useEffect(() => {
    if (theme !== 'system') return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      applyTheme(e.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', handler)
    return () => {
      mq.removeEventListener('change', handler)
    }
  }, [theme, applyTheme])

  const setTheme = React.useCallback(
    (next: Theme) => {
      setThemeState(next)
      localStorage.setItem(STORAGE_KEY, next)
      const resolved = next === 'system' ? getSystemTheme() : next
      applyTheme(resolved)
    },
    [applyTheme, getSystemTheme],
  )

  const toggleTheme = React.useCallback(() => {
    const next: ResolvedTheme = resolvedTheme === 'light' ? 'dark' : 'light'
    setTheme(next)
  }, [resolvedTheme, setTheme])

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext)
  return context
}

export { ThemeProvider, useTheme }
export type { ResolvedTheme, Theme, ThemeContextValue }
