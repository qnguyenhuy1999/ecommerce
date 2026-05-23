'use client'

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ecom/core-ui'
import { Calendar, Download } from 'lucide-react'
import { useMemo } from 'react'
import { SellerListPage } from '../../organisms'
import { buildAuditLogColumns } from './AuditLog.columns'
import { useAuditLogController } from './AuditLog.controller'
import type {
  AuditLogActorRole,
  AuditLogDateRange,
  AuditLogEntry,
  AuditLogFilterOption,
  AuditLogProps,
  AuditLogResource,
} from './AuditLog.types'

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

export type { AuditLogActorRole, AuditLogDateRange, AuditLogResource }

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
  const { state, computed, handlers } = useAuditLogController({ items })
  const columns = useMemo(() => buildAuditLogColumns(), [])

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
        data={computed.filteredItems}
        emptyMessage={emptyStateMessage}
        toolbar={
          <SellerListPage.Filters className="items-stretch justify-between gap-3 xl:flex-row xl:items-center">
            <SellerListPage.Search
              value={state.search}
              onChange={handlers.setSearch}
              placeholder={searchPlaceholder}
            />
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap gap-3">
                <FilterSelect
                  value={state.actorFilter}
                  options={actorOptions}
                  onChange={handlers.setActorFilter}
                />
                <FilterSelect
                  value={state.resourceFilter}
                  options={resourceOptions}
                  onChange={handlers.setResourceFilter}
                />
                <FilterSelect
                  value={state.actionFilter}
                  options={actionOptions}
                  onChange={handlers.setActionFilter}
                />
              </div>
              <DateRangeSelect
                value={state.dateRange}
                options={dateRangeOptions}
                onChange={handlers.setDateRange}
              />
            </div>
          </SellerListPage.Filters>
        }
      />
    </SellerListPage.Header>
  )
}
