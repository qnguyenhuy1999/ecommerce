'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@ecom/core-ui/atoms/Avatar'
import { Button } from '@ecom/core-ui/atoms/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ecom/core-ui/molecules/DropdownMenu'
import { ChevronDown, LogOut } from 'lucide-react'

interface StorefrontAccountMenuProps {
  userDisplayName: string
  userEmail: string | undefined
  userAvatarUrl: string | undefined
  userInitials: string
  onLogout: (() => void | Promise<void>) | undefined
}

export function StorefrontAccountMenu({
  userDisplayName,
  userEmail,
  userAvatarUrl,
  userInitials,
  onLogout,
}: StorefrontAccountMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 rounded-full px-3">
          <Avatar className="size-8">
            {userAvatarUrl ? <AvatarImage src={userAvatarUrl} alt={userDisplayName} /> : null}
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <span className="flex min-w-0 flex-col items-start leading-tight">
            <span className="truncate text-sm font-semibold">{userDisplayName}</span>
            {userEmail ? (
              <span className="text-muted-foreground truncate text-xs font-normal">
                {userEmail}
              </span>
            ) : null}
          </span>
          <ChevronDown className="text-muted-foreground size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-72">
        <DropdownMenuLabel className="space-y-1 py-2">
          <div className="text-sm font-semibold">{userDisplayName}</div>
          {userEmail ? (
            <div className="text-muted-foreground text-xs font-normal">{userEmail}</div>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => void onLogout?.()}>
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
