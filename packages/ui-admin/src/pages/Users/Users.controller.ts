import { useCallback, useMemo, useState } from 'react'
import {
  buildUserStatusCounts,
  matchesJoinedRange,
  USERS_STATUS_TAB_ORDER,
} from './Users.constants'
import type {
  UserAccountRecord,
  UserAccountRole,
  UserAccountStatus,
  UsersJoinedRange,
  UsersProps,
} from './Users.types'

interface UsersControllerProps {
  items: UserAccountRecord[]
  statusTabs: NonNullable<UsersProps['statusTabs']>
  onExport: UsersProps['onExport']
  onInvite: UsersProps['onInvite']
}

interface UsersState {
  search: string
  roleFilter: 'ALL' | UserAccountRole
  statusFilter: 'ALL' | UserAccountStatus
  joinedFilter: UsersJoinedRange
  activeTab: 'ALL' | UserAccountStatus
}

export function useUsersController({
  items,
  statusTabs,
  onExport,
  onInvite,
}: UsersControllerProps) {
  const [state, setState] = useState<UsersState>({
    search: '',
    roleFilter: 'ALL',
    statusFilter: 'ALL',
    joinedFilter: 'ANY',
    activeTab: 'ALL',
  })

  const counts = useMemo(() => buildUserStatusCounts(statusTabs), [statusTabs])

  const filteredItems = useMemo(() => {
    const query = state.search.trim().toLowerCase()

    return items.filter((item) => {
      const matchesSearch =
        query.length === 0 ||
        item.name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query)
      const matchesRole = state.roleFilter === 'ALL' || item.role === state.roleFilter
      const matchesStatusFilter = state.statusFilter === 'ALL' || item.status === state.statusFilter
      const matchesTab = state.activeTab === 'ALL' || item.status === state.activeTab
      const matchesJoined = matchesJoinedRange(item.joinedAt, state.joinedFilter)

      return matchesSearch && matchesRole && matchesStatusFilter && matchesTab && matchesJoined
    })
  }, [items, state])

  const setSearch = useCallback((search: string) => {
    setState((current) => ({ ...current, search }))
  }, [])

  const setRoleFilter = useCallback((roleFilter: 'ALL' | UserAccountRole) => {
    setState((current) => ({ ...current, roleFilter }))
  }, [])

  const setStatusFilter = useCallback((statusFilter: 'ALL' | UserAccountStatus) => {
    setState((current) => ({ ...current, statusFilter }))
  }, [])

  const setJoinedFilter = useCallback((joinedFilter: UsersJoinedRange) => {
    setState((current) => ({ ...current, joinedFilter }))
  }, [])

  const setActiveTab = useCallback((activeTab: 'ALL' | UserAccountStatus) => {
    setState((current) => ({ ...current, activeTab }))
  }, [])

  const handleExport = useCallback(() => {
    void onExport?.()
  }, [onExport])

  const handleInvite = useCallback(() => {
    void onInvite?.()
  }, [onInvite])

  return {
    state,
    counts,
    filteredItems,
    statusTabOrder: USERS_STATUS_TAB_ORDER,
    setSearch,
    setRoleFilter,
    setStatusFilter,
    setJoinedFilter,
    setActiveTab,
    handleExport,
    handleInvite,
  }
}
