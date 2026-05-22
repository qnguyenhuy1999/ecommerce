'use client'

import {
  Button,
  type DataTableColumn,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Typography,
} from '@ecom/core-ui'
import { Calendar, Download } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SellerListPage } from '../../organisms'
import type {
  AuditLogActorRole,
  AuditLogDateRange,
  AuditLogEntry,
  AuditLogFilterOption,
  AuditLogProps,
  AuditLogResource,
} from './AuditLog.types'

export interface AuditLogClientProps {
  searchPlaceholder: string
  exportLabel: string
  emptyStateMessage: string
  actorOptions: AuditLogFilterOption<'ALL' | AuditLogActorRole>[]
  resourceOptions: AuditLogFilterOption<'ALL' | AuditLogResource>[]
  actionOptions: AuditLogFilterOption<'ALL' | string>[]
  dateRangeOptions: AuditLogFilterOption<AuditLogDateRange>[]
  items: AuditLogEntry[]
  onExport?: AuditLogProps['onExport']
}

const REFERENCE_DATE = new Date('2026-05-11T00:00:00Z')

function matchesDateRange(timestamp: string, range: AuditLogDateRange): boolean {
  if (range === 'ALL_TIME') return true
  const entryDate = new Date(`${timestamp}T00:00:00Z`)
  const dayDiff = Math.floor(
    (REFERENCE_DATE.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24),
  )
  switch (range) {
    case 'LAST_7_DAYS':
      return dayDiff <= 7
    case 'LAST_30_DAYS':
      return dayDiff <= 30
    case 'LAST_90_DAYS':
      return dayDiff <= 90
  }
}

function FilterSelect<TValue extends string>({
  value,
  options,
  onChange,
}: {
  value: TValue
  options: AuditLogFilterOption<TValue>[]
  onChange: (value: TValue) => void
}) {
  return (
    <div className="min-w-40">
      <Select value={value} onValueChange={(next) => onChange(next as TValue)}>
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

function DateRangeSelect({
  value,
  options,
  onChange,
}: {
  value: AuditLogDateRange
  options: AuditLogFilterOption<AuditLogDateRange>[]
  onChange: (value: AuditLogDateRange) => void
}) {
  return (
    <div className="min-w-44">
      <Select value={value} onValueChange={(next) => onChange(next as AuditLogDateRange)}>
        <SelectTrigger className="border-input bg-background h-10 rounded-2xl shadow-none">
          <Calendar className="text-muted-foreground size-4 shrink-0" />
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

function buildColumns(): DataTableColumn<AuditLogEntry>[] {
  return [
    {
      accessorKey: 'timestampLabel',
      header: 'Timestamp',
      cell: ({ row }) => (
        <Typography variant="body-sm" className="text-muted-foreground whitespace-nowrap">
          {row.original.timestampLabel}
        </Typography>
      ),
    },
    {
      id: 'actor',
      header: 'Actor',
      cell: ({ row }) => (
        <div>
          <Typography as="div" variant="label" className="text-foreground whitespace-nowrap">
            {row.original.actorName}
          </Typography>
          <Typography variant="body-sm" className="text-muted-foreground">
            {row.original.actorRole}
          </Typography>
        </div>
      ),
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <Typography variant="body-sm" className="font-mono">
          {row.original.action}
        </Typography>
      ),
    },
    {
      accessorKey: 'resource',
      header: 'Resource',
    },
    {
      accessorKey: 'target',
      header: 'Target',
    },
    {
      accessorKey: 'ip',
      header: 'IP',
      cell: ({ row }) => (
        <Typography variant="body-sm" className="text-muted-foreground font-mono whitespace-nowrap">
          {row.original.ip}
        </Typography>
      ),
    },
  ]
}

export function AuditLogClient({
  searchPlaceholder,
  exportLabel,
  emptyStateMessage,
  actorOptions,
  resourceOptions,
  actionOptions,
  dateRangeOptions,
  items,
  onExport,
}: AuditLogClientProps) {
  const [search, setSearch] = useState('')
  const [actorFilter, setActorFilter] = useState<'ALL' | AuditLogActorRole>('ALL')
  const [resourceFilter, setResourceFilter] = useState<'ALL' | AuditLogResource>('ALL')
  const [actionFilter, setActionFilter] = useState<'ALL' | string>('ALL')
  const [dateRange, setDateRange] = useState<AuditLogDateRange>('LAST_7_DAYS')

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    return items.filter((item) => {
      const matchesSearch =
        query.length === 0 ||
        item.actorName.toLowerCase().includes(query) ||
        item.action.toLowerCase().includes(query) ||
        item.target.toLowerCase().includes(query)
      const matchesActor = actorFilter === 'ALL' || item.actorRole === actorFilter
      const matchesResource = resourceFilter === 'ALL' || item.resource === resourceFilter
      const matchesAction = actionFilter === 'ALL' || item.action === actionFilter
      const matchesDate = matchesDateRange(item.timestamp, dateRange)
      return matchesSearch && matchesActor && matchesResource && matchesAction && matchesDate
    })
  }, [actionFilter, actorFilter, dateRange, items, resourceFilter, search])

  const columns = useMemo(() => buildColumns(), [])

  return (
    <SellerListPage.Header>
      <div className="flex items-center justify-end">
        <SellerListPage.Actions>
          <Button type="button" variant="outline" onClick={() => void onExport?.()}>
            <Download className="size-4" />
            {exportLabel}
          </Button>
        </SellerListPage.Actions>
      </div>

      <SellerListPage.Table
        columns={columns}
        data={filteredItems}
        emptyMessage={emptyStateMessage}
        toolbar={
          <SellerListPage.Filters className="items-stretch justify-between gap-3 xl:flex-row xl:items-center">
            <SellerListPage.Search
              value={search}
              onChange={setSearch}
              placeholder={searchPlaceholder}
            />
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap gap-3">
                <FilterSelect
                  value={actorFilter}
                  options={actorOptions}
                  onChange={setActorFilter}
                />
                <FilterSelect
                  value={resourceFilter}
                  options={resourceOptions}
                  onChange={setResourceFilter}
                />
                <FilterSelect
                  value={actionFilter}
                  options={actionOptions}
                  onChange={setActionFilter}
                />
              </div>
              <DateRangeSelect
                value={dateRange}
                options={dateRangeOptions}
                onChange={setDateRange}
              />
            </div>
          </SellerListPage.Filters>
        }
      />
    </SellerListPage.Header>
  )
}
