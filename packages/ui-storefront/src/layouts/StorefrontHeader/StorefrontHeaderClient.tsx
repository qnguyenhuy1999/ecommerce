'use client'

import React, { useEffect, useState } from 'react'

import { Heart, Menu, ShoppingBag } from 'lucide-react'

import { Button, cn, Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from '@ecom/ui'

import { SearchBar } from '../../molecules/SearchBar/SearchBar'

export interface StorefrontHeaderClientProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: React.ReactNode
  cartCount?: number
  wishlistCount?: number
  onCartClick?: () => void
  onMenuClick?: () => void
  user?: { name: string; avatar?: string }
  onLogin?: () => void
  onLogout?: () => void
  categories?: { label: string; href: string }[]
}

export function StorefrontHeaderClient(props: StorefrontHeaderClientProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const {
    logo,
    cartCount = 0,
    wishlistCount = 0,
    onCartClick,
    onMenuClick,
    user,
    onLogin,
    onLogout,
    categories = [],
    className,
    ...restProps
  } = props

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-[var(--motion-normal)] ease-[var(--motion-ease-out)]',
        isScrolled
          ? 'bg-background/90 backdrop-blur-2xl shadow-[var(--elevation-sm)] py-3'
          : 'bg-background py-5 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-border/40',
        className,
      )}
      {...restProps}
    >
      <div className="max-w-[var(--storefront-content-max-width)] mx-auto px-4 sm:px-6 md:px-8 w-full flex flex-col gap-5 md:gap-6">
        {/* Top Row */}
        <div className="flex items-center justify-between gap-6 md:gap-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
              <Menu className="w-6 h-6 text-foreground/80" />
            </Button>
            {logo && (
              <div className="shrink-0 scale-90 md:scale-100 origin-left hover:opacity-90 transition-opacity">
                {logo}
              </div>
            )}
          </div>

          <div className="hidden md:block flex-1 max-w-3xl">
            <SearchBar
              placeholder="Search products, brands, categories..."
              suggestions={['New Arrivals', 'Best Sellers', 'Summer Sale']}
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {user ? (
              <Dropdown>
                <DropdownTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden sm:flex items-center gap-3 rounded-full pl-2 pr-5 h-11 border border-border/60 shadow-sm bg-background hover:shadow-[var(--elevation-sm)] hover:border-border transition-all duration-[var(--motion-fast)]"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand text-brand-foreground flex items-center justify-center text-sm font-bold shadow-inner">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                  </Button>
                </DropdownTrigger>
                <DropdownContent
                  align="end"
                  className="w-56 mt-2 rounded-xl shadow-[var(--elevation-md)] border-border/50"
                >
                  <DropdownItem className="rounded-md py-2.5 px-3 cursor-pointer font-medium text-sm">
                    Profile
                  </DropdownItem>
                  <DropdownItem className="rounded-md py-2.5 px-3 cursor-pointer font-medium text-sm">
                    Orders
                  </DropdownItem>
                  <DropdownItem className="rounded-md py-2.5 px-3 cursor-pointer font-medium text-sm">
                    Settings
                  </DropdownItem>
                  <div className="h-px bg-border/50 my-1.5 mx-1" />
                  <DropdownItem
                    onClick={onLogout}
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive rounded-md py-2.5 px-3 cursor-pointer font-medium text-sm"
                  >
                    Log out
                  </DropdownItem>
                </DropdownContent>
              </Dropdown>
            ) : (
              <Button
                variant="default"
                className="hidden sm:flex h-11 px-6 rounded-full font-medium transition-all shadow-[var(--elevation-sm)] hover:shadow-[var(--elevation-md)] active:scale-[0.98]"
                onClick={onLogin}
              >
                Log in
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="relative group h-11 w-11 rounded-full hover:bg-muted/60 transition-all duration-[var(--motion-fast)]"
            >
              <Heart className="w-5 h-5 text-foreground/80 group-hover:text-brand transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 px-1 bg-foreground text-background text-[length:var(--text-micro)] font-bold rounded-full flex items-center justify-center pointer-events-none ring-2 ring-background group-hover:bg-brand transition-colors shadow-sm">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative group h-11 w-11 rounded-full hover:bg-muted/60 transition-all duration-[var(--motion-fast)]"
              onClick={onCartClick}
            >
              <ShoppingBag className="w-5 h-5 text-foreground/80 group-hover:text-brand transition-colors" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 px-1 bg-brand text-brand-foreground text-[length:var(--text-micro)] font-bold rounded-full flex items-center justify-center pointer-events-none ring-2 ring-background shadow-sm">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Categories Nav */}
        {categories.length > 0 && (
          <div
            className={cn(
              'hidden md:flex items-center justify-center gap-1.5 transition-all duration-[var(--motion-normal)] ease-out',
              isScrolled ? 'h-0 overflow-hidden opacity-0 m-0' : 'h-auto opacity-100',
            )}
          >
            {categories.map((cat, i) => (
              <a
                key={i}
                href={cat.href}
                className="px-4 py-2 rounded-full text-[14px] font-medium text-foreground/75 hover:text-foreground hover:bg-muted/60 transition-colors duration-[var(--motion-fast)] relative after:absolute after:bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-brand after:transition-all after:duration-[var(--motion-fast)] hover:after:w-4"
              >
                {cat.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
