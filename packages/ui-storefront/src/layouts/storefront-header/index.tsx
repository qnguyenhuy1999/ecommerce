'use client'

import React from 'react'

import { ShoppingBag, Heart, Menu } from 'lucide-react'

import { cn, Button, Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from '@ecom/ui'

import { SearchBar } from '../../molecules/search-bar'

export interface StorefrontHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
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

function StorefrontHeader({
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
  ...props
}: StorefrontHeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-[var(--motion-normal)] ease-[var(--motion-ease-out)]',
        isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm py-2' : 'bg-background py-4',
        className,
      )}
      {...props}
    >
      <div className="max-w-[var(--storefront-content-max-width)] mx-auto px-4 md:px-8 w-full flex flex-col gap-4">
        {/* Top Row: Logo, Search, Actions */}
        <div className="flex items-center justify-between gap-4 md:gap-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
              <Menu className="w-5 h-5" />
            </Button>
            {logo && <div className="shrink-0 scale-90 md:scale-100 origin-left">{logo}</div>}
          </div>

          <div className="hidden md:block flex-1 max-w-2xl px-4">
            <SearchBar
              placeholder="Search products, brands, categories..."
              suggestions={['New Arrivals', 'Best Sellers', 'Summer Sale']}
            />
          </div>

          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {user ? (
              <Dropdown>
                <DropdownTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden sm:flex items-center gap-2 rounded-full pl-2 pr-4 h-10 border shadow-sm hover:shadow-[var(--elevation-hover)] transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-brand text-brand-foreground flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                  </Button>
                </DropdownTrigger>
                <DropdownContent align="end" className="w-48 mt-1">
                  <DropdownItem>Profile</DropdownItem>
                  <DropdownItem>Orders</DropdownItem>
                  <DropdownItem>Settings</DropdownItem>
                  <div className="h-px bg-border my-1" />
                  <DropdownItem
                    onClick={onLogout}
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    Log out
                  </DropdownItem>
                </DropdownContent>
              </Dropdown>
            ) : (
              <Button
                variant="ghost"
                className="hidden sm:flex h-10 rounded-full font-semibold"
                onClick={onLogin}
              >
                Log in
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="relative group h-10 w-10 rounded-full hover:bg-muted transition-colors"
            >
              <Heart className="w-5 h-5 text-foreground group-hover:text-brand transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-foreground text-background text-[10px] font-bold rounded-full flex items-center justify-center pointer-events-none group-hover:bg-brand transition-colors">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative group h-10 w-10 rounded-full hover:bg-muted transition-colors"
              onClick={onCartClick}
            >
              <ShoppingBag className="w-5 h-5 text-foreground group-hover:text-brand transition-colors" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-brand text-brand-foreground text-[10px] font-bold rounded-full flex items-center justify-center pointer-events-none ring-2 ring-background">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Categories Nav (Hidden on scroll for compact view) */}
        {!isScrolled && categories.length > 0 && (
          <div className="hidden md:flex items-center justify-center gap-8 animate-in fade-in slide-in-from-top-2 duration-[var(--motion-normal)]">
            {categories.map((cat, i) => (
              <a
                key={i}
                href={cat.href}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-foreground after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
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

export { StorefrontHeader }
