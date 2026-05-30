'use client'

import { Button } from '@ecom/core-ui/atoms/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ecom/core-ui/molecules/Select'
import { Download, UserPlus } from 'lucide-react'
import { useMemo } from 'react'
import { SellerListPage } from '../../organisms'
import { buildUserColumns } from './Users.columns'
import { useUsersController } from './Users.controller'
import type {
  UserAccountRecord,
  UserAccountRole,
  UserAccountStatus,
  UserFilterOption,
  UsersJoinedRange,
  UsersProps,
} from './Users.types'

function FilterSelect<TValue extends string>({
  value,
  options,
  onChange,
}: {
  value: TValue
  options: UserFilterOption<TValue>[]
  onChange: (value: TValue) => void
}) {
  return (
    <div className="min-w-40">
      <Select value={value} onValueChange={(nextValue) => onChange(nextValue as TValue)}>
        <SelectTrigger className="border-input bg-background h-10 rounded-2xl shadow-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

interface UsersClientProps {
  searchPlaceholder: string
  exportLabel: string
  inviteLabel: string
  emptyStateMessage: string
  roleOptions: UserFilterOption<'ALL' | UserAccountRole>[]
  statusOptions: UserFilterOption<'ALL' | UserAccountStatus>[]
  joinedOptions: UserFilterOption<UsersJoinedRange>[]
  statusTabs: NonNullable<UsersProps['statusTabs']>
  items: UserAccountRecord[]
  onExport?: UsersProps['onExport']
  onInvite?: UsersProps['onInvite']
}

export function UsersClient({
  searchPlaceholder,
  exportLabel,
  inviteLabel,
  emptyStateMessage,
  roleOptions,
  statusOptions,
  joinedOptions,
  statusTabs,
  items,
  onExport,
  onInvite,
}: UsersClientProps) {
  const controller = useUsersController({ items, statusTabs, onExport, onInvite })
  const columns = useMemo(() => buildUserColumns(), [])

  return (
    <SellerListPage.Header>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SellerListPage.StatusTabs
          tabs={controller.statusTabOrder}
          value={controller.state.activeTab}
          onChange={(tab) => controller.setActiveTab(tab as 'ALL' | UserAccountStatus)}
          counts={controller.counts}
        />
        <SellerListPage.Actions>
          <Button type="button" variant="outline" onClick={controller.handleExport}>
            <Download className="size-4" />
            {exportLabel}
          </Button>
          <Button type="button" onClick={controller.handleInvite}>
            <UserPlus className="size-4" />
            {inviteLabel}
          </Button>
        </SellerListPage.Actions>
      </div>

      <SellerListPage.Table
        columns={columns}
        data={controller.filteredItems}
        enableRowSelection
        emptyMessage={emptyStateMessage}
        toolbar={
          <SellerListPage.Filters className="items-stretch justify-between gap-3 xl:flex-row xl:items-center">
            <SellerListPage.Search
              value={controller.state.search}
              onChange={controller.setSearch}
              placeholder={searchPlaceholder}
            />
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap gap-3">
                <FilterSelect
                  value={controller.state.roleFilter}
                  options={roleOptions}
                  onChange={controller.setRoleFilter}
                />
                <FilterSelect
                  value={controller.state.statusFilter}
                  options={statusOptions}
                  onChange={controller.setStatusFilter}
                />
              </div>
              <FilterSelect
                value={controller.state.joinedFilter}
                options={joinedOptions}
                onChange={controller.setJoinedFilter}
              />
            </div>
          </SellerListPage.Filters>
        }
      />
    </SellerListPage.Header>
  )
}
