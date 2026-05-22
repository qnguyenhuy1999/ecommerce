'use client'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Checkbox,
  DataTable,
  type DataTableColumn,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatusBadge,
  StatusTabs,
  TableToolbar,
  Typography,
} from '@ecom/core-ui'
import { Download, UserPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import type {
  UserAccountRecord,
  UserAccountRole,
  UserAccountStatus,
  UserFilterOption,
  UsersJoinedRange,
  UsersProps,
} from './Users.types'

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

const STATUS_TAB_ORDER: Array<'ALL' | UserAccountStatus> = [
  'ALL',
  'ACTIVE',
  'SUSPENDED',
  'INVITED',
  'LOCKED',
]

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

function matchesJoinedRange(joinedAt: string, joinedFilter: UsersJoinedRange) {
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

function buildStatusCounts(statusTabs: NonNullable<UsersProps['statusTabs']>) {
  return statusTabs.reduce<Record<string, number>>((accumulator, tab) => {
    accumulator[tab.value] = tab.count
    return accumulator
  }, {})
}

function buildUserColumns(): DataTableColumn<UserAccountRecord>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
                ? 'indeterminate'
                : false
          }
          onCheckedChange={(checked) => table.toggleAllPageRowsSelected(Boolean(checked))}
          aria-label="Select all visible users"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
          aria-label={`Select ${row.original.name}`}
        />
      ),
    },
    {
      id: 'user',
      header: 'User',
      cell: ({ row }) => {
        const item = row.original

        return (
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="size-10 rounded-full">
              <AvatarImage src={item.avatarUrl} alt={item.name} />
              <AvatarFallback>{item.avatarFallback}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <Typography as="div" variant="label" className="truncate">
                {item.name}
              </Typography>
              <Typography variant="body-sm" className="text-muted-foreground truncate">
                {item.email}
              </Typography>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => row.original.role.charAt(0) + row.original.role.slice(1).toLowerCase(),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'countryCode',
      header: 'Country',
    },
    {
      accessorKey: 'ordersCount',
      header: () => <div className="text-right">Orders</div>,
      cell: ({ row }) => <div className="text-right">{row.original.ordersCount}</div>,
    },
    {
      accessorKey: 'spendLabel',
      header: () => <div className="text-right">Spend</div>,
      cell: ({ row }) => (
        <Typography variant="body-sm" className="text-warning block text-right font-semibold">
          {row.original.spendLabel}
        </Typography>
      ),
    },
    {
      accessorKey: 'lastSeenLabel',
      header: 'Last seen',
      cell: ({ row }) => (
        <Typography variant="body-sm" className="text-muted-foreground">
          {row.original.lastSeenLabel}
        </Typography>
      ),
    },
  ]
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
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserAccountRole>('ALL')
  const [statusFilter, setStatusFilter] = useState<'ALL' | UserAccountStatus>('ALL')
  const [joinedFilter, setJoinedFilter] = useState<UsersJoinedRange>('ANY')
  const [activeTab, setActiveTab] = useState<'ALL' | UserAccountStatus>('ALL')

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()

    return items.filter((item) => {
      const matchesSearch =
        query.length === 0 ||
        item.name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query)
      const matchesRole = roleFilter === 'ALL' || item.role === roleFilter
      const matchesStatusFilter = statusFilter === 'ALL' || item.status === statusFilter
      const matchesTab = activeTab === 'ALL' || item.status === activeTab
      const matchesJoined = matchesJoinedRange(item.joinedAt, joinedFilter)

      return matchesSearch && matchesRole && matchesStatusFilter && matchesTab && matchesJoined
    })
  }, [activeTab, items, joinedFilter, roleFilter, search, statusFilter])

  const columns = useMemo(() => buildUserColumns(), [])
  const counts = useMemo(() => buildStatusCounts(statusTabs), [statusTabs])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <StatusTabs
          tabs={STATUS_TAB_ORDER}
          value={activeTab}
          onChange={(tab) => setActiveTab(tab as 'ALL' | UserAccountStatus)}
          counts={counts}
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="outline" onClick={() => void onExport?.()}>
            <Download className="size-4" />
            {exportLabel}
          </Button>
          <Button type="button" onClick={() => void onInvite?.()}>
            <UserPlus className="size-4" />
            {inviteLabel}
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredItems}
        enableRowSelection
        emptyMessage={emptyStateMessage}
        toolbar={
          <TableToolbar
            search={search}
            onSearchChange={setSearch}
            placeholder={searchPlaceholder}
            className="items-stretch justify-between gap-3 xl:flex-row xl:items-center"
          >
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap gap-3">
                <FilterSelect value={roleFilter} options={roleOptions} onChange={setRoleFilter} />
                <FilterSelect
                  value={statusFilter}
                  options={statusOptions}
                  onChange={setStatusFilter}
                />
              </div>
              <FilterSelect
                value={joinedFilter}
                options={joinedOptions}
                onChange={setJoinedFilter}
              />
            </div>
          </TableToolbar>
        }
      />
    </div>
  )
}
