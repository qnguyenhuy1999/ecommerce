export type UserAccountRole = 'BUYER' | 'SELLER' | 'MODERATOR' | 'SUPPORT' | 'ADMIN'

export type UserAccountStatus = 'ACTIVE' | 'SUSPENDED' | 'INVITED' | 'LOCKED'

export type UsersJoinedRange = 'ANY' | 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'LAST_90_DAYS'

export interface UserFilterOption<TValue extends string = string> {
  value: TValue
  label: string
}

export interface UserAccountRecord {
  id: string
  name: string
  email: string
  avatarUrl: string
  avatarFallback: string
  role: UserAccountRole
  status: UserAccountStatus
  countryCode: string
  ordersCount: number
  spendLabel: string
  lastSeenLabel: string
  joinedAt: string
}

export interface UsersStatusTab {
  value: 'ALL' | UserAccountStatus
  label: string
  count: number
}

export interface UsersProps {
  title?: string
  description?: string
  searchPlaceholder?: string
  exportLabel?: string
  inviteLabel?: string
  emptyStateMessage?: string
  roleOptions?: UserFilterOption<'ALL' | UserAccountRole>[]
  statusOptions?: UserFilterOption<'ALL' | UserAccountStatus>[]
  joinedOptions?: UserFilterOption<UsersJoinedRange>[]
  statusTabs?: UsersStatusTab[]
  items?: UserAccountRecord[]
  onExport?: (() => void | Promise<void>) | undefined
  onInvite?: (() => void | Promise<void>) | undefined
}
