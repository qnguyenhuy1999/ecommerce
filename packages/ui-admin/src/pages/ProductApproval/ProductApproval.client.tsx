'use client'

import {
  Badge,
  Button,
  Card,
  CardContent,
  Checkbox,
  DataTable,
  type DataTableColumn,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Label,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  StatusBadge,
  StatusTabs,
  TableToolbar,
  Textarea,
  Typography,
} from '@ecom/core-ui'
import { X } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import type {
  ProductApprovalActionPayload,
  ProductApprovalItem,
  ProductApprovalProps,
  ProductApprovalStatus,
} from './ProductApproval.types'

interface ProductApprovalClientProps {
  searchPlaceholder: string
  approveLabel: string
  rejectLabel: string
  approveDialogTitle: string
  approveDialogDescription: string
  rejectDialogTitle: string
  rejectDialogDescription: string
  reasonLabel: string
  reasonPlaceholder: string
  reasonHint: string
  items: ProductApprovalItem[]
  statusTabs: NonNullable<ProductApprovalProps['statusTabs']>
  onApprove?: ProductApprovalProps['onApprove']
  onReject?: ProductApprovalProps['onReject']
}

interface ProductApprovalState {
  activeStatus: ProductApprovalStatus
  search: string
  selectedIds: string[]
  detailItemId: string | null
  sheetOpen: boolean
  pendingAction: PendingAction | null
  reason: string
  reasonError: string
  submitting: boolean
}

type PendingAction = 'approve' | 'reject'

function getReasonTagTone(status: ProductApprovalStatus) {
  switch (status) {
    case 'REPORTED':
      return 'bg-warning/10 text-warning'
    case 'REJECTED':
      return 'bg-destructive/10 text-destructive'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

function filterItems(
  items: ProductApprovalItem[],
  activeStatus: ProductApprovalStatus,
  search: string,
) {
  const query = search.trim().toLowerCase()

  return items.filter((item) => {
    const matchesStatus = item.status === activeStatus
    const matchesSearch =
      query.length === 0 ||
      item.title.toLowerCase().includes(query) ||
      item.sellerName.toLowerCase().includes(query)

    return matchesStatus && matchesSearch
  })
}

function buildStatusCounts(statusTabs: NonNullable<ProductApprovalProps['statusTabs']>) {
  return statusTabs.reduce<Record<string, number>>((accumulator, tab) => {
    accumulator[tab.value] = tab.count
    return accumulator
  }, {})
}

function areIdsEqual(current: string[], next: string[]) {
  return current.length === next.length && current.every((id, index) => id === next[index])
}

function ReasonTags({
  item,
  emptyLabel = '—',
}: {
  item: ProductApprovalItem
  emptyLabel?: string
}) {
  if (item.reasonTags.length === 0) {
    return (
      <Typography variant="body-sm" className="text-muted-foreground">
        {emptyLabel}
      </Typography>
    )
  }

  return (
    <>
      {item.reasonTags.map((tag) => (
        <Badge
          key={tag.id}
          variant="secondary"
          className={`rounded-full ${getReasonTagTone(item.status)}`}
        >
          {tag.label}
        </Badge>
      ))}
    </>
  )
}

function ProductApprovalModal({
  open,
  action,
  ids,
  reason,
  reasonLabel,
  reasonPlaceholder,
  reasonHint,
  title,
  description,
  rejectLabel,
  approveLabel,
  submitting,
  error,
  onReasonChange,
  onClose,
  onConfirm,
}: {
  open: boolean
  action: PendingAction
  ids: string[]
  reason: string
  reasonLabel: string
  reasonPlaceholder: string
  reasonHint: string
  title: string
  description: string
  rejectLabel: string
  approveLabel: string
  submitting: boolean
  error: string
  onReasonChange: (value: string) => void
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <Drawer open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DrawerContent className="mx-auto w-full max-w-lg">
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close dialog"
            onClick={onClose}
            className="absolute top-4 right-4"
          >
            <X className="size-4" />
          </Button>
          <DrawerHeader className="space-y-1 text-left">
            <DrawerTitle id="product-approval-dialog-title">{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
        </div>

        <div className="space-y-2 px-4 pb-4">
          <Label htmlFor="product-approval-reason" className="text-sm font-medium">
            {reasonLabel} <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="product-approval-reason"
            required
            aria-invalid={error ? 'true' : 'false'}
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
            placeholder={reasonPlaceholder}
            className="min-h-28 rounded-2xl"
          />
          <Typography variant="caption" className="text-muted-foreground">
            {reasonHint}
          </Typography>
          {error ? (
            <Typography role="alert" variant="caption" className="text-destructive">
              {error}
            </Typography>
          ) : null}
        </div>

        <DrawerFooter className="gap-3 border-t">
          <Typography variant="caption" className="text-muted-foreground">
            {ids.length} listing{ids.length === 1 ? '' : 's'} selected
          </Typography>
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant={action === 'approve' ? 'default' : 'destructive'}
              loading={submitting}
              onClick={onConfirm}
            >
              {action === 'approve' ? approveLabel : rejectLabel}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function DetailSheetContent({
  item,
  approveLabel,
  rejectLabel,
  onApprove,
  onReject,
}: {
  item: ProductApprovalItem | null
  approveLabel: string
  rejectLabel: string
  onApprove: (id: string) => void
  onReject: (id: string) => void
}) {
  if (!item) {
    return null
  }

  return (
    <>
      <SheetHeader className="border-border space-y-1 border-b px-5 py-5">
        <SheetTitle className="text-lg font-semibold">{item.title}</SheetTitle>
        <SheetDescription>
          {item.sellerName} · submitted {item.submittedAtLabel}
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
        <div className="grid grid-cols-2 gap-3">
          {item.images.map((image) => (
            <div key={image.id} className="bg-muted aspect-[1.12] overflow-hidden rounded-2xl">
              <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>

        <Card className="rounded-3xl shadow-none">
          <CardContent className="space-y-3 p-5">
            <div>
              <Typography as="h3" variant="label" className="text-base">
                {item.title}
              </Typography>
              <Typography
                variant="h3"
                className="text-primary mt-2 scroll-m-0 border-none p-0 text-2xl"
              >
                {item.priceLabel}
              </Typography>
            </div>
            <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
              <span>{item.stockLabel}</span>
              <span>·</span>
              <span>{item.soldLabel}</span>
              <span>·</span>
              <span>{item.ratingLabel}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Typography as="h3" variant="label">
            Policy tags
          </Typography>
          <div className="flex flex-wrap gap-2">
            <ReasonTags item={item} emptyLabel="No policy tags" />
          </div>
        </div>
      </div>

      <SheetFooter className="border-border flex-row justify-end border-t px-5 py-4">
        <Button type="button" variant="outline" onClick={() => onReject(item.id)}>
          {rejectLabel}
        </Button>
        <Button type="button" onClick={() => onApprove(item.id)}>
          {approveLabel}
        </Button>
      </SheetFooter>
    </>
  )
}

function buildProductApprovalColumns({
  onOpenDetail,
}: {
  onOpenDetail: (item: ProductApprovalItem) => void
}): DataTableColumn<ProductApprovalItem>[] {
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
          aria-label="Select all visible listings"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
          aria-label={`Select ${row.original.title}`}
        />
      ),
    },
    {
      id: 'listing',
      header: 'Listing',
      cell: ({ row }) => {
        const item = row.original

        return (
          <Button
            type="button"
            variant="ghost"
            className="h-auto w-full justify-start rounded-2xl px-0 py-0 text-left hover:bg-transparent"
            onClick={() => onOpenDetail(item)}
          >
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={item.images[0]?.src}
                alt={item.images[0]?.alt ?? item.title}
                className="bg-muted size-10 rounded-xl object-cover"
              />
              <div className="min-w-0">
                <Typography as="div" variant="label" className="truncate">
                  {item.title}
                </Typography>
                <Typography variant="body-sm" className="text-muted-foreground">
                  {item.sellerName}
                </Typography>
              </div>
            </div>
          </Button>
        )
      },
    },
    {
      accessorKey: 'priceLabel',
      header: 'Price',
      cell: ({ row }) => (
        <Typography as="span" variant="label" className="text-primary">
          {row.original.priceLabel}
        </Typography>
      ),
    },
    {
      accessorKey: 'flagsLabel',
      header: 'Flags',
      cell: ({ row }) => (
        <Typography variant="body-sm" className="text-muted-foreground">
          {row.original.flagsLabel}
        </Typography>
      ),
    },
    {
      id: 'reasonTags',
      header: 'Reason / Tags',
      cell: ({ row }) => (
        <div className="flex flex-wrap items-center gap-2">
          <ReasonTags item={row.original} />
        </div>
      ),
    },
    {
      accessorKey: 'submittedAtLabel',
      header: 'Submitted',
      cell: ({ row }) => (
        <Typography variant="body-sm" className="text-muted-foreground">
          {row.original.submittedAtLabel}
        </Typography>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ]
}

function getInitialState(
  items: ProductApprovalItem[],
  statusTabs: NonNullable<ProductApprovalProps['statusTabs']>,
): ProductApprovalState {
  return {
    activeStatus: statusTabs[0]?.value ?? 'PENDING',
    search: '',
    selectedIds: [],
    detailItemId: items[0]?.id ?? null,
    sheetOpen: false,
    pendingAction: null,
    reason: '',
    reasonError: '',
    submitting: false,
  }
}

function useProductApprovalController({
  items,
  statusTabs,
  onApprove,
  onReject,
}: Pick<ProductApprovalClientProps, 'items' | 'statusTabs' | 'onApprove' | 'onReject'>) {
  const [state, setState] = useState<ProductApprovalState>(() => getInitialState(items, statusTabs))

  const statusCounts = useMemo(() => buildStatusCounts(statusTabs), [statusTabs])
  const filteredItems = useMemo(
    () => filterItems(items, state.activeStatus, state.search),
    [items, state.activeStatus, state.search],
  )
  const detailItem = useMemo(
    () => items.find((item) => item.id === state.detailItemId) ?? null,
    [items, state.detailItemId],
  )

  function openAction(action: PendingAction, ids: string[]) {
    if (ids.length === 0) {
      return
    }

    setState((current) => ({
      ...current,
      pendingAction: action,
      selectedIds: ids,
      reason: '',
      reasonError: '',
      submitting: false,
    }))
  }

  function closeAction() {
    setState((current) => ({
      ...current,
      pendingAction: null,
      reason: '',
      reasonError: '',
      submitting: false,
    }))
  }

  const setSelectedItems = useCallback((selectedItems: ProductApprovalItem[]) => {
    const nextSelectedIds = selectedItems.map((item) => item.id)

    setState((current) => {
      if (areIdsEqual(current.selectedIds, nextSelectedIds)) {
        return current
      }

      return {
        ...current,
        selectedIds: nextSelectedIds,
      }
    })
  }, [])

  async function submitAction() {
    if (!state.pendingAction) {
      return
    }

    const trimmedReason = state.reason.trim()
    if (!trimmedReason) {
      setState((current) => ({ ...current, reasonError: 'Reason required.' }))
      return
    }

    const payload: ProductApprovalActionPayload = {
      ids: state.selectedIds,
      reason: trimmedReason,
      action: state.pendingAction,
    }

    setState((current) => ({ ...current, submitting: true, reasonError: '' }))

    try {
      if (state.pendingAction === 'approve') {
        await onApprove?.(payload)
      } else {
        await onReject?.(payload)
      }

      closeAction()
    } catch (error) {
      setState((current) => ({
        ...current,
        submitting: false,
        reasonError: error instanceof Error && error.message ? error.message : 'Action failed.',
      }))
    }
  }

  function openDetail(item: ProductApprovalItem) {
    setState((current) => ({
      ...current,
      detailItemId: item.id,
      sheetOpen: true,
    }))
  }

  function setSearch(search: string) {
    setState((current) => ({ ...current, search }))
  }

  function setActiveStatus(activeStatus: ProductApprovalStatus) {
    setState((current) => ({ ...current, activeStatus }))
  }

  function setSheetOpen(sheetOpen: boolean) {
    setState((current) => ({ ...current, sheetOpen }))
  }

  function setReason(reason: string) {
    setState((current) => ({
      ...current,
      reason,
      reasonError: '',
    }))
  }

  return {
    state,
    statusCounts,
    filteredItems,
    detailItem,
    setSelectedItems,
    setSearch,
    setActiveStatus,
    setSheetOpen,
    setReason,
    openDetail,
    openAction,
    closeAction,
    submitAction,
  }
}

export function ProductApprovalClient({
  searchPlaceholder,
  approveLabel,
  rejectLabel,
  approveDialogTitle,
  approveDialogDescription,
  rejectDialogTitle,
  rejectDialogDescription,
  reasonLabel,
  reasonPlaceholder,
  reasonHint,
  items,
  statusTabs,
  onApprove,
  onReject,
}: ProductApprovalClientProps) {
  const controller = useProductApprovalController({
    items,
    statusTabs,
    onApprove,
    onReject,
  })
  const columns = useMemo(
    () => buildProductApprovalColumns({ onOpenDetail: controller.openDetail }),
    [controller.openDetail],
  )

  return (
    <>
      <div className="space-y-4">
        <StatusTabs
          tabs={statusTabs.map((tab) => tab.value)}
          value={controller.state.activeStatus}
          onChange={(value) => controller.setActiveStatus(value as ProductApprovalStatus)}
          counts={controller.statusCounts}
        />

        <DataTable
          columns={columns}
          data={controller.filteredItems}
          enableRowSelection
          onSelectionChange={controller.setSelectedItems}
          emptyMessage="No listings found."
          toolbar={
            <TableToolbar
              search={controller.state.search}
              onSearchChange={controller.setSearch}
              placeholder={searchPlaceholder}
            />
          }
          bulkActions={
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => controller.openAction('reject', controller.state.selectedIds)}
              >
                {rejectLabel}
              </Button>
              <Button
                type="button"
                onClick={() => controller.openAction('approve', controller.state.selectedIds)}
              >
                {approveLabel}
              </Button>
            </div>
          }
        />
      </div>

      <Sheet open={controller.state.sheetOpen} onOpenChange={controller.setSheetOpen}>
        <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-xl">
          <DetailSheetContent
            item={controller.detailItem}
            approveLabel={approveLabel}
            rejectLabel={rejectLabel}
            onApprove={(id) => controller.openAction('approve', [id])}
            onReject={(id) => controller.openAction('reject', [id])}
          />
        </SheetContent>
      </Sheet>

      {controller.state.pendingAction ? (
        <ProductApprovalModal
          open={Boolean(controller.state.pendingAction)}
          action={controller.state.pendingAction}
          ids={controller.state.selectedIds}
          reason={controller.state.reason}
          reasonLabel={reasonLabel}
          reasonPlaceholder={reasonPlaceholder}
          reasonHint={reasonHint}
          title={
            controller.state.pendingAction === 'approve' ? approveDialogTitle : rejectDialogTitle
          }
          description={
            controller.state.pendingAction === 'approve'
              ? approveDialogDescription
              : rejectDialogDescription
          }
          rejectLabel={rejectLabel}
          approveLabel={approveLabel}
          submitting={controller.state.submitting}
          error={controller.state.reasonError}
          onReasonChange={controller.setReason}
          onClose={controller.closeAction}
          onConfirm={() => void controller.submitAction()}
        />
      ) : null}
    </>
  )
}
