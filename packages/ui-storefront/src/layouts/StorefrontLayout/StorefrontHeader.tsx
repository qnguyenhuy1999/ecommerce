import { Badge } from '@ecom/core-ui/atoms/Badge'
import { Button } from '@ecom/core-ui/atoms/Button'
import { Input } from '@ecom/core-ui/atoms/Input'
import { Separator } from '@ecom/core-ui/atoms/Separator'
import { Typography } from '@ecom/core-ui/atoms/Typography'
import { Bell, Heart, MessageSquare, Search, ShoppingCart, Store } from 'lucide-react'
import { StorefrontAccountMenu } from './StorefrontAccountMenu.client'
import type { StorefrontHeaderProps, StorefrontNavItem } from './StorefrontLayout.types'

interface StorefrontHeaderDefaults {
  cartCount: number
  notificationCount: number
  sellerLabel: string
  chatHref: string
  chatUnreadCount: number
  userDisplayName: string
  userInitials: string
}

const defaultHeaderProps: StorefrontHeaderDefaults = {
  cartCount: 3,
  notificationCount: 3,
  sellerLabel: 'Seller',
  chatHref: '/messages',
  chatUnreadCount: 0,
  userDisplayName: 'Account',
  userInitials: 'A',
}

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

export function StorefrontHeader({ header }: { header?: StorefrontHeaderProps | undefined }) {
  const cartCount = header?.cartCount ?? defaultHeaderProps.cartCount
  const notificationCount = header?.notificationCount ?? defaultHeaderProps.notificationCount
  const sellerLabel = header?.sellerLabel ?? defaultHeaderProps.sellerLabel
  const chatHref = header?.chatHref ?? defaultHeaderProps.chatHref
  const chatUnreadCount = header?.chatUnreadCount ?? defaultHeaderProps.chatUnreadCount
  const userDisplayName = header?.userDisplayName ?? defaultHeaderProps.userDisplayName
  const userEmail = header?.userEmail
  const userAvatarUrl = header?.userAvatarUrl
  const userInitials = header?.userInitials ?? defaultHeaderProps.userInitials
  const onLogout = header?.onLogout

  return (
    <header className="bg-card border-b">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6">
        <a href="#" className="flex shrink-0 items-center gap-2">
          <span className="bg-primary-soft text-primary flex size-11 items-center justify-center rounded-2xl">
            <span className="size-4 rounded-full border-2 border-current" />
          </span>
          <Typography variant="h3" className="text-foreground hidden border-0 p-0 sm:block">
            Halo
          </Typography>
          <Typography variant="label" className="text-muted-foreground hidden lg:block">
            Market
          </Typography>
        </a>
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-4 size-5 -translate-y-1/2" />
          <Input
            className="h-12 rounded-full pr-28 pl-12"
            placeholder="Search shops, products, brands..."
          />
          <Button className="absolute top-1/2 right-1 hidden -translate-y-1/2 rounded-full px-6 sm:inline-flex">
            Search
          </Button>
        </div>
        <div className="hidden items-center gap-1 lg:flex">
          <Button variant="ghost" size="icon" aria-label="Favorites">
            <Heart />
          </Button>
          <a
            href={chatHref}
            aria-label="Messages"
            className="text-foreground hover:bg-accent relative inline-flex size-10 items-center justify-center rounded-full transition-colors"
          >
            <MessageSquare className="size-5" />
            {chatUnreadCount > 0 ? (
              <Badge
                variant="destructive"
                size="sm"
                className="absolute -top-1 -right-1 min-w-5 rounded-full px-1.5"
              >
                {chatUnreadCount > 99 ? '99+' : chatUnreadCount}
              </Badge>
            ) : null}
          </a>
          <Button variant="ghost" size="icon" aria-label="Cart" className="relative">
            <ShoppingCart />
            <span className="bg-destructive text-destructive-foreground absolute top-0 right-0 flex size-5 items-center justify-center rounded-full text-xs">
              {cartCount}
            </span>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
            <Bell />
            <span className="bg-destructive text-destructive-foreground absolute top-0 right-0 flex size-5 items-center justify-center rounded-full text-xs">
              {notificationCount}
            </span>
          </Button>
          <Separator orientation="vertical" className="mx-2 h-7" />
          <Button variant="ghost">
            <Store />
            {sellerLabel}
          </Button>
          <StorefrontAccountMenu
            userDisplayName={userDisplayName}
            userEmail={userEmail}
            userAvatarUrl={userAvatarUrl}
            userInitials={userInitials}
            onLogout={onLogout}
          />
        </div>
      </div>
    </header>
  )
}

export function StorefrontNavigation({ navigation }: { navigation: StorefrontNavItem[] }) {
  return (
    <nav className="bg-card border-b">
      <div className="no-scrollbar mx-auto flex max-w-7xl gap-8 overflow-x-auto px-4 py-4 sm:px-6">
        {navigation.map((item, index) => (
          <a
            key={item.label}
            href={item.href ?? '#'}
            className={
              index === 0
                ? 'text-primary shrink-0 text-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground shrink-0 text-sm font-medium'
            }
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
