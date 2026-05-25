'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatusBadge,
  Typography,
} from '@ecom/core-ui'
import { useMemo } from 'react'
import { SellerListPage } from '../../organisms'
import { buildRefundColumns } from './Disputes.columns'
import { useRefundsController } from './Disputes.controller'
import type {
  RefundCasePriority,
  RefundCaseQueue,
  RefundRecord,
  RefundCaseResolution,
  RefundStatus,
  RefundCaseFilterOption,
  RefundsProps,
} from './Disputes.types'

export function RefundStatusBadge({ status }: { status: RefundStatus }) {
  return <StatusBadge status={status} />
}

function FilterSelect<TValue extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: TValue
  options: RefundCaseFilterOption<TValue>[]
  onChange: (value: TValue) => void
}) {
  return (
    <Select value={value} onValueChange={(nextValue) => onChange(nextValue as TValue)}>
      <SelectTrigger className="border-border bg-background h-10 rounded-2xl shadow-none">
        <SelectValue aria-label={label} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface RefundsClientProps {
  searchPlaceholder: string
  openLabel: string
  summaryLabel: string
  filtersLabel: string
  emptyStateMessage: string
  priorityOptions: RefundCaseFilterOption<'ALL' | RefundCasePriority>[]
  statusOptions: RefundCaseFilterOption<'ALL' | RefundStatus>[]
  queueOptions: RefundCaseFilterOption<'ALL' | RefundCaseQueue>[]
  resolutionOptions: RefundCaseFilterOption<'ALL' | RefundCaseResolution>[]
  items: RefundRecord[]
  onOpenCase?: RefundsProps['onOpenCase']
}

export function RefundsClient({
  searchPlaceholder,
  openLabel,
  summaryLabel,
  filtersLabel,
  emptyStateMessage,
  priorityOptions,
  statusOptions,
  queueOptions,
  resolutionOptions,
  items,
  onOpenCase,
}: RefundsClientProps) {
  const controller = useRefundsController({ items, onOpenCase })

  const columns = useMemo(
    () =>
      buildRefundColumns({
        openLabel,
        onOpen: controller.handleOpen,
      }),
    [openLabel, controller.handleOpen],
  )

  return (
    <SellerListPage.Header>
      <SellerListPage.Table
        columns={columns}
        data={controller.filteredItems}
        emptyMessage={emptyStateMessage}
        toolbar={
          <SellerListPage.Filters>
            <SellerListPage.Search
              value={controller.state.search}
              onChange={controller.setSearch}
              placeholder={searchPlaceholder}
            />
            <div className="flex flex-wrap items-center gap-3">
              <Typography variant="caption" className="text-muted-foreground uppercase">
                {filtersLabel}
              </Typography>
              <FilterSelect
                label="Priority"
                value={controller.state.priorityFilter}
                options={priorityOptions}
                onChange={controller.setPriorityFilter}
              />
              <FilterSelect
                label="Status"
                value={controller.state.statusFilter}
                options={statusOptions}
                onChange={controller.setStatusFilter}
              />
              <FilterSelect
                label="Queue"
                value={controller.state.queueFilter}
                options={queueOptions}
                onChange={controller.setQueueFilter}
              />
              <FilterSelect
                label="Resolution"
                value={controller.state.resolutionFilter}
                options={resolutionOptions}
                onChange={controller.setResolutionFilter}
              />
            </div>
          </SellerListPage.Filters>
        }
      />

      <Typography variant="body-sm" className="text-muted-foreground">
        {controller.filteredItems.length} {summaryLabel}
      </Typography>
    </SellerListPage.Header>
  )
}
