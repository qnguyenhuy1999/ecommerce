import React from 'react'

import {
  User as UserIcon,
  LogOut,
  CircleHelp,
  CreditCard,
  MessageCircle,
  Plus,
  ToggleLeft,
  Zap,
} from 'lucide-react'

import type { BadgeProps } from '@ecom/ui'

// Exported for consumers and tests
type AdminHeaderUserMenuSection = 'primary' | 'secondary'

export interface AdminHeaderUserMenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  onSelect?: () => void
  destructive?: boolean
  section?: AdminHeaderUserMenuSection
  highlighted?: boolean
  rightSlot?: React.ReactNode
  badge?: {
    label: string
    icon?: React.ReactNode
    variant?: BadgeProps['variant']
  }
}

export const DEFAULT_USER_MENU_ITEMS: AdminHeaderUserMenuItem[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: <UserIcon className="h-4 w-4" />,
    highlighted: true,
    section: 'primary',
  },
  {
    id: 'community',
    label: 'Community',
    icon: <MessageCircle className="h-4 w-4" />,
    section: 'primary',
    rightSlot: (
      <span className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--surface-muted)] text-[var(--text-secondary)]">
        <Plus className="h-3.5 w-3.5" />
      </span>
    ),
  },
  {
    id: 'subscription',
    label: 'Subscription',
    icon: <CreditCard className="h-4 w-4" />,
    section: 'primary',
    badge: {
      label: 'PRO',
      icon: <Zap className="h-3 w-3" />,
      variant: 'success',
    },
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <ToggleLeft className="h-4 w-4" />,
    section: 'primary',
  },
  {
    id: 'help-center',
    label: 'Help center',
    icon: <CircleHelp className="h-4 w-4" />,
    section: 'secondary',
  },
  {
    id: 'logout',
    label: 'Sign out',
    icon: <LogOut className="h-4 w-4" />,
    destructive: true,
    section: 'secondary',
  },
]
