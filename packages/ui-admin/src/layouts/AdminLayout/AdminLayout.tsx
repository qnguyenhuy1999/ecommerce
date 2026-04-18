'use client'

import React, { useState, useEffect } from 'react'

import { Menu, X } from 'lucide-react'

import { cn, Button } from '@ecom/ui'

interface AdminLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar?: React.ReactNode
  header?: React.ReactNode
  children: React.ReactNode
  sidebarWidth?: string
  headerHeight?: string
  isNavigating?: boolean
}

function AdminLayout({
  sidebar,
  header,
  children,
  sidebarWidth = '16rem',
  className,
  isNavigating = false,
  ...props
}: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const hasSidebar = Boolean(sidebar)

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div
      className={cn('min-h-screen bg-background flex flex-col lg:flex-row', className)}
      {...props}
    >
      {/* Top Loading Bar */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-brand/20 overflow-hidden">
          <div
            className="h-full bg-brand animate-[indeterminate_1s_infinite_linear] origin-left"
            style={{ width: '50%' }}
          />
        </div>
      )}

      {/* Mobile Header with Menu Toggle (only visible below lg) */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40">
        <div className="flex-1">{/* Logo could go here if extracted from sidebar */}</div>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setMobileMenuOpen(false)
          }}
        />
      )}

      {/* Sidebar (Fixed Desktop, Drawer Mobile) */}
      {sidebar && (
        <div
          className={cn(
            'fixed inset-y-0 left-0 z-50 h-screen shrink-0 bg-background border-r transition-transform duration-[var(--motion-normal)] ease-[var(--motion-ease-out)]',
            'lg:translate-x-0 lg:sticky lg:top-0',
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
          )}
          style={{ width: sidebarWidth }}
        >
          {sidebar}
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0',
          hasSidebar && 'lg:pl-[var(--admin-layout-sidebar-width)]',
        )}
        style={
          hasSidebar
            ? ({ ['--admin-layout-sidebar-width' as string]: sidebarWidth } as React.CSSProperties)
            : undefined
        }
      >
        {header && (
          <div className="hidden lg:block sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            {header}
          </div>
        )}

        <div className="lg:hidden">{header}</div>

        <main className="flex-1 relative">
          <div
            key={isNavigating ? 'navigating' : 'idle'}
            className="p-4 md:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-2 duration-[var(--motion-normal)] fill-mode-both"
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export { AdminLayout }
export type { AdminLayoutProps }
