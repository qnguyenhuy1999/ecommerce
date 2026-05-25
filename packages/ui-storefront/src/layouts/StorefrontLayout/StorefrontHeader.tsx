import { Button, Input, Separator, Typography } from '@ecom/core-ui'
import { Bell, Heart, Search, ShoppingCart, Store, UserRound } from 'lucide-react'
import type { StorefrontNavItem } from './StorefrontLayout.types'

export function StorefrontAnnouncement({
  announcement,
  links,
}: {
  announcement: string
  links: StorefrontNavItem[]
}) {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
        <Typography variant="caption" className="font-semibold">
          {announcement}
        </Typography>
        <div className="hidden items-center gap-4 md:flex">
          {links.map((link) => (
            <a key={link.label} href={link.href ?? '#'} className="text-xs font-medium">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export function StorefrontHeader() {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6">
        <a href="#" className="flex shrink-0 items-center gap-2">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <span className="size-4 rounded-full border-2 border-current" />
          </span>
          <Typography variant="h3" className="hidden border-0 p-0 text-foreground sm:block">
            Halo
          </Typography>
          <Typography variant="label" className="hidden text-muted-foreground lg:block">
            Market
          </Typography>
        </a>
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-12 rounded-full pl-12 pr-28"
            placeholder="Search shops, products, brands..."
          />
          <Button className="absolute right-1 top-1/2 hidden -translate-y-1/2 rounded-full px-6 sm:inline-flex">
            Search
          </Button>
        </div>
        <div className="hidden items-center gap-1 lg:flex">
          <Button variant="ghost" size="icon" aria-label="Favorites">
            <Heart />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Cart" className="relative">
            <ShoppingCart />
            <span className="absolute right-0 top-0 flex size-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
              3
            </span>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
            <Bell />
            <span className="absolute right-0 top-0 flex size-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
              3
            </span>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Account">
            <UserRound />
          </Button>
          <Separator orientation="vertical" className="mx-2 h-7" />
          <Button variant="ghost">
            <Store />
            Seller
          </Button>
        </div>
      </div>
    </header>
  )
}

export function StorefrontNavigation({ navigation }: { navigation: StorefrontNavItem[] }) {
  return (
    <nav className="border-b bg-card">
      <div className="no-scrollbar mx-auto flex max-w-7xl gap-8 overflow-x-auto px-4 py-4 sm:px-6">
        {navigation.map((item, index) => (
          <a
            key={item.label}
            href={item.href ?? '#'}
            className={
              index === 0
                ? 'shrink-0 text-sm font-semibold text-primary'
                : 'shrink-0 text-sm font-medium text-muted-foreground hover:text-foreground'
            }
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
