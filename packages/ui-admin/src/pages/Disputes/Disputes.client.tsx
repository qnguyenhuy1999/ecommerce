'use client'

import {
  Button,
  Card,
  CardContent,
  DataTable,
  type DataTableColumn,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  StatusBadge,
  TableToolbar,
  Typography,
} from '@ecom/core-ui'
import { ArrowRight, Circle } from 'lucide-react'
import { useMemo, useState } from 'react'
import type {
  DisputeFilterOption,
  DisputePriority,
  DisputeQueue,
  DisputeRecord,
  DisputeResolution,
  DisputesProps,
  DisputeStatus,
} from './Disputes.types'

interface DisputesClientProps {
  searchPlaceholder: string
  openLabel: string
  summaryLabel: string
  filtersLabel: string
  emptyStateMessage: string
  detailTitle: string
  priorityOptions: DisputeFilterOption<'ALL' | DisputePriority>[]
  statusOptions: DisputeFilterOption<'ALL' | DisputeStatus>[]
  queueOptions: DisputeFilterOption<'ALL' | DisputeQueue>[]
  resolutionOptions: DisputeFilterOption<'ALL' | DisputeResolution>[]
  items: DisputeRecord[]
  onOpenCase?: DisputesProps['onOpenCase']
}

function getPriorityDotClassName(priority: DisputePriority) {
  switch (priority) {
    case 'HIGH':
      return 'fill-destructive text-destructive'
    case 'MEDIUM':
      return 'fill-warning text-warning'
    case 'LOW':
      return 'fill-muted-foreground text-muted-foreground'
    default:
      return 'fill-muted-foreground text-muted-foreground'
  }
}

function FilterSelect<TValue extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: TValue
  options: DisputeFilterOption<TValue>[]
  onChange: (value: TValue) => void
}) {
  return (
    <div className="min-w-36">
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
    </div>
  )
}

function buildDisputeColumns({
  openLabel,
  onOpen,
}: {
  openLabel: string
  onOpen: (item: DisputeRecord) => void
}): DataTableColumn<DisputeRecord>[] {
  return [
    {
      accessorKey: 'id',
      header: 'Dispute',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Circle className={`size-3 ${getPriorityDotClassName(row.original.priority)}`} />
          <Typography as="span" variant="body-sm" className="font-semibold tracking-wide">
            {row.original.id}
          </Typography>
        </div>
      ),
    },
    {
      accessorKey: 'orderId',
      header: 'Order',
      cell: ({ row }) => (
        <Typography variant="body-sm" className="text-muted-foreground">
          {row.original.orderId}
        </Typography>
      ),
    },
    {
      id: 'participants',
      header: 'Buyer ↔ Seller',
      cell: ({ row }) => `${row.original.buyerName} ↔ ${row.original.sellerName}`,
    },
    {
      accessorKey: 'amountLabel',
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => (
        <Typography variant="body-sm" className="text-warning block text-right font-semibold">
          {row.original.amountLabel}
        </Typography>
      ),
    },
    {
      accessorKey: 'reason',
      header: 'Reason',
      cell: ({ row }) => (
        <Typography variant="body-sm" className="text-muted-foreground">
          {row.original.reason}
        </Typography>
      ),
    },
    {
      accessorKey: 'openedAtLabel',
      header: 'Opened',
      cell: ({ row }) => (
        <Typography variant="body-sm" className="text-muted-foreground">
          {row.original.openedAtLabel}
        </Typography>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              void onOpen(row.original)
            }}
          >
            {openLabel}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      ),
    },
  ]
}

function DisputeDetailSheet({
  item,
  open,
  title,
  onOpenChange,
}: {
  item: DisputeRecord | null
  open: boolean
  title: string
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-xl gap-0 overflow-y-auto p-0 sm:max-w-xl">
        {item ? (
          <>
            <SheetHeader className="border-border border-b px-6 py-5 text-left">
              <SheetTitle className="text-xl">{item.id}</SheetTitle>
              <SheetDescription>
                {item.buyerName} ↔ {item.sellerName}
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-6 px-6 py-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="rounded-2xl shadow-none">
                  <CardContent className="space-y-1 p-4">
                    <Typography variant="caption" className="text-muted-foreground uppercase">
                      {title}
                    </Typography>
                    <Typography variant="h4" className="text-lg">
                      {item.reason}
                    </Typography>
                    <Typography variant="body-sm" className="text-muted-foreground">
                      {item.note}
                    </Typography>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl shadow-none">
                  <CardContent className="space-y-2 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <Typography variant="caption" className="text-muted-foreground uppercase">
                        Status
                      </Typography>
                      <StatusBadge status={item.status} />
                    </div>
                    <Typography variant="body-sm">{item.ownerLabel}</Typography>
                    <Typography variant="body-sm" className="text-muted-foreground">
                      {item.timelineLabel}
                    </Typography>
                  </CardContent>
                </Card>
              </div>

              <Card className="rounded-2xl shadow-none">
                <CardContent className="grid gap-4 p-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Typography variant="caption" className="text-muted-foreground uppercase">
                      Order
                    </Typography>
                    <Typography variant="body-sm">{item.orderId}</Typography>
                  </div>
                  <div className="space-y-1">
                    <Typography variant="caption" className="text-muted-foreground uppercase">
                      Amount
                    </Typography>
                    <Typography variant="body-sm" className="text-warning font-semibold">
                      {item.amountLabel}
                    </Typography>
                  </div>
                  <div className="space-y-1">
                    <Typography variant="caption" className="text-muted-foreground uppercase">
                      Queue
                    </Typography>
                    <Typography variant="body-sm">{item.queue}</Typography>
                  </div>
                  <div className="space-y-1">
                    <Typography variant="caption" className="text-muted-foreground uppercase">
                      Opened
                    </Typography>
                    <Typography variant="body-sm">{item.openedAtLabel}</Typography>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

export function DisputesClient({
  searchPlaceholder,
  openLabel,
  summaryLabel,
  filtersLabel,
  emptyStateMessage,
  detailTitle,
  priorityOptions,
  statusOptions,
  queueOptions,
  resolutionOptions,
  items,
  onOpenCase,
}: DisputesClientProps) {
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | DisputePriority>('ALL')
  const [statusFilter, setStatusFilter] = useState<'ALL' | DisputeStatus>('ALL')
  const [queueFilter, setQueueFilter] = useState<'ALL' | DisputeQueue>('ALL')
  const [resolutionFilter, setResolutionFilter] = useState<'ALL' | DisputeResolution>('ALL')
  const [detailItem, setDetailItem] = useState<DisputeRecord | null>(null)

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()

    return items.filter((item) => {
      const matchesSearch =
        query.length === 0 ||
        item.id.toLowerCase().includes(query) ||
        item.orderId.toLowerCase().includes(query) ||
        item.buyerName.toLowerCase().includes(query) ||
        item.sellerName.toLowerCase().includes(query) ||
        item.reason.toLowerCase().includes(query)

      const matchesPriority = priorityFilter === 'ALL' || item.priority === priorityFilter
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter
      const matchesQueue = queueFilter === 'ALL' || item.queue === queueFilter
      const matchesResolution = resolutionFilter === 'ALL' || item.resolution === resolutionFilter

      return matchesSearch && matchesPriority && matchesStatus && matchesQueue && matchesResolution
    })
  }, [items, priorityFilter, queueFilter, resolutionFilter, search, statusFilter])

  function handleOpen(item: DisputeRecord) {
    setDetailItem(item)
    void onOpenCase?.(item)
  }

  const columns = useMemo(
    () =>
      buildDisputeColumns({
        openLabel,
        onOpen: handleOpen,
      }),
    [openLabel],
  )

  return (
    <>
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={filteredItems}
          emptyMessage={emptyStateMessage}
          toolbar={
            <TableToolbar
              search={search}
              onSearchChange={setSearch}
              placeholder={searchPlaceholder}
            >
              <div className="flex flex-wrap items-center gap-3">
                <Typography variant="caption" className="text-muted-foreground uppercase">
                  {filtersLabel}
                </Typography>
                <FilterSelect
                  label="Priority"
                  value={priorityFilter}
                  options={priorityOptions}
                  onChange={setPriorityFilter}
                />
                <FilterSelect
                  label="Status"
                  value={statusFilter}
                  options={statusOptions}
                  onChange={setStatusFilter}
                />
                <FilterSelect
                  label="Queue"
                  value={queueFilter}
                  options={queueOptions}
                  onChange={setQueueFilter}
                />
                <FilterSelect
                  label="Resolution"
                  value={resolutionFilter}
                  options={resolutionOptions}
                  onChange={setResolutionFilter}
                />
              </div>
            </TableToolbar>
          }
        />

        <Typography variant="body-sm" className="text-muted-foreground">
          {filteredItems.length} {summaryLabel}
        </Typography>
      </div>

      <DisputeDetailSheet
        item={detailItem}
        open={detailItem !== null}
        title={detailTitle}
        onOpenChange={(open) => {
          if (!open) {
            setDetailItem(null)
          }
        }}
      />
    </>
  )
}
