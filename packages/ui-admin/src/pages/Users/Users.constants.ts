import type { UserAccountStatus, UsersProps } from './Users.types'

export const USERS_STATUS_TAB_ORDER: Array<'ALL' | UserAccountStatus> = [
  'ALL',
  'ACTIVE',
  'SUSPENDED',
  'INVITED',
  'LOCKED',
] as const

export function buildUserStatusCounts(
  statusTabs: NonNullable<UsersProps['statusTabs']>,
): Record<string, number> {
  return statusTabs.reduce<Record<string, number>>((accumulator, tab) => {
    accumulator[tab.value] = tab.count
    return accumulator
  }, {})
}

export function matchesJoinedRange(
  joinedAt: string,
  joinedFilter: 'ANY' | 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'LAST_90_DAYS',
): boolean {
  if (joinedFilter === 'ANY') {
    return true
  }

  const joinedDate = new Date(`${joinedAt}T00:00:00Z`)
  const latestDate = new Date('2026-05-11T00:00:00Z')
  const dayDifference = Math.floor(
    (latestDate.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24),
  )

  switch (joinedFilter) {
    case 'LAST_7_DAYS':
      return dayDifference <= 7
    case 'LAST_30_DAYS':
      return dayDifference <= 30
    case 'LAST_90_DAYS':
      return dayDifference <= 90
    default:
      return true
  }
}
