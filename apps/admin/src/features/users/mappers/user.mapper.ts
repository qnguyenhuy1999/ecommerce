import type {
  UserAccountRecord,
  UserAccountStatus,
  UserAccountRole,
  UsersStatusTab,
} from '@ecom/ui-admin/pages/Users'
import type { UserListItem } from '../api/users.api'

function toAccountStatus(status: string): UserAccountStatus {
  const map: Record<string, UserAccountStatus> = {
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
    BANNED: 'SUSPENDED',
    LOCKED: 'LOCKED',
    INVITED: 'INVITED',
    PENDING: 'INVITED',
  }
  return map[status] ?? 'ACTIVE'
}

function toAvatarFallback(
  firstName: string | null,
  lastName: string | null,
  email: string,
): string {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase()
  if (firstName) return firstName.slice(0, 2).toUpperCase()
  return email.slice(0, 2).toUpperCase()
}

export function mapUserToAccountRecord(user: UserListItem): UserAccountRecord {
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email
  return {
    id: user.id,
    name,
    email: user.email,
    avatarUrl: '',
    avatarFallback: toAvatarFallback(user.firstName, user.lastName, user.email),
    role: 'BUYER' satisfies UserAccountRole,
    status: toAccountStatus(user.status),
    countryCode: '',
    ordersCount: 0,
    spendLabel: '—',
    lastSeenLabel: '—',
    joinedAt: user.createdAt,
  } satisfies UserAccountRecord
}

export function buildUsersStatusTabs(counts: Record<string, number>): UsersStatusTab[] {
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  return [
    { value: 'ALL', label: 'All', count: total },
    { value: 'ACTIVE', label: 'Active', count: counts['ACTIVE'] ?? 0 },
    { value: 'SUSPENDED', label: 'Suspended', count: counts['SUSPENDED'] ?? 0 },
    { value: 'INVITED', label: 'Invited', count: counts['INVITED'] ?? 0 },
    { value: 'LOCKED', label: 'Locked', count: counts['LOCKED'] ?? 0 },
  ]
}
