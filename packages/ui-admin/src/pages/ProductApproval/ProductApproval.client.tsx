'use client'

import {
  Badge,
  Button,
  Card,
  CardContent,
  Checkbox,
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
import { useMemo, useState } from 'react'
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

const tableHeaderClassName =
  'text-muted-foreground px-4 py-4 text-left text-xs font-semibold tracking-[0.06em] uppercase'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-8">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-approval-dialog-title"
        className="bg-card border-border relative w-full max-w-md rounded-[28px] border shadow-2xl"
      >
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground absolute top-5 right-5"
        >
          <X className="size-4" />
        </button>
        <div className="space-y-5 p-5 sm:p-6">
          <div className="space-y-1">
            <Typography
              id="product-approval-dialog-title"
              as="h2"
              variant="h4"
              className="scroll-m-0 text-lg"
            >
              {title}
            </Typography>
            <Typography variant="body-sm" className="text-muted-foreground">
              {description}
            </Typography>
          </div>

          <div className="space-y-2">
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
              className="min-h-28 rounded-[20px]"
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

          <div className="flex items-center justify-between gap-3">
            <Typography variant="caption" className="text-muted-foreground">
              {ids.length} listing{ids.length === 1 ? '' : 's'} selected
            </Typography>
            <div className="flex items-center gap-2">
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
          </div>
        </div>
      </div>
    </div>
  )
}

function ModerationTable({
  items,
  selectedIds,
  allVisibleSelected,
  onToggleAll,
  onToggleSelected,
  onOpenDetail,
}: {
  items: ProductApprovalItem[]
  selectedIds: string[]
  allVisibleSelected: boolean
  onToggleAll: (checked: boolean) => void
  onToggleSelected: (id: string, checked: boolean) => void
  onOpenDetail: (item: ProductApprovalItem) => void
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1080px] border-separate border-spacing-0 text-sm">
        <thead>
          <tr className="bg-muted/80">
            <th className={`${tableHeaderClassName} w-12`}>
              <Checkbox
                checked={allVisibleSelected}
                onCheckedChange={(checked) => onToggleAll(Boolean(checked))}
                aria-label="Select all visible listings"
              />
            </th>
            <th className={tableHeaderClassName}>Listing</th>
            <th className={tableHeaderClassName}>Price</th>
            <th className={tableHeaderClassName}>Flags</th>
            <th className={tableHeaderClassName}>Reason / Tags</th>
            <th className={tableHeaderClassName}>Submitted</th>
            <th className={tableHeaderClassName}>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.id)

            return (
              <tr
                key={item.id}
                onClick={() => onOpenDetail(item)}
                className="hover:bg-muted/40 cursor-pointer transition-colors"
              >
                <td className="border-border border-t px-4 py-4">
                  <Checkbox
                    checked={isSelected}
                    onClick={(event) => event.stopPropagation()}
                    onCheckedChange={(checked) => onToggleSelected(item.id, Boolean(checked))}
                    aria-label={`Select ${item.title}`}
                  />
                </td>
                <td className="border-border border-t px-4 py-4">
                  <div className="flex items-center gap-3">
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
                </td>
                <td className="border-border border-t px-4 py-4">
                  <Typography as="span" variant="label" className="text-primary">
                    {item.priceLabel}
                  </Typography>
                </td>
                <td className="border-border text-muted-foreground border-t px-4 py-4">
                  {item.flagsLabel}
                </td>
                <td className="border-border border-t px-4 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <ReasonTags item={item} />
                  </div>
                </td>
                <td className="border-border text-muted-foreground border-t px-4 py-4">
                  {item.submittedAtLabel}
                </td>
                <td className="border-border border-t px-4 py-4">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function SelectionBar({
  count,
  approveLabel,
  rejectLabel,
  onApprove,
  onReject,
}: {
  count: number
  approveLabel: string
  rejectLabel: string
  onApprove: () => void
  onReject: () => void
}) {
  if (count === 0) {
    return null
  }

  return (
    <div className="bg-card border-border flex items-center justify-between gap-3 rounded-[22px] border px-4 py-3">
      <Typography variant="label">{count} listing selected</Typography>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" onClick={onReject}>
          {rejectLabel}
        </Button>
        <Button type="button" onClick={onApprove}>
          {approveLabel}
        </Button>
      </div>
    </div>
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

        <Card className="rounded-[24px] shadow-none">
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

function addUniqueIds(current: string[], ids: string[]) {
  return Array.from(new Set([...current, ...ids]))
}

function removeIds(current: string[], ids: string[]) {
  return current.filter((id) => !ids.includes(id))
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

  const allVisibleSelected =
    filteredItems.length > 0 && filteredItems.every((item) => state.selectedIds.includes(item.id))

  function setSelectedIds(update: string[] | ((current: string[]) => string[])) {
    setState((current) => ({
      ...current,
      selectedIds: typeof update === 'function' ? update(current.selectedIds) : update,
    }))
  }

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

  function toggleAllVisible(checked: boolean) {
    const visibleIds = filteredItems.map((item) => item.id)

    setSelectedIds((current) => {
      if (checked) {
        return addUniqueIds(current, visibleIds)
      }

      return removeIds(current, visibleIds)
    })
  }

  function toggleSelected(id: string, checked: boolean) {
    setSelectedIds((current) =>
      checked ? Array.from(new Set([...current, id])) : current.filter((value) => value !== id),
    )
  }

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
    allVisibleSelected,
    setSearch,
    setActiveStatus,
    setSheetOpen,
    setReason,
    toggleAllVisible,
    toggleSelected,
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

  return (
    <>
      <div className="space-y-4">
        <div className="bg-card border-border overflow-hidden rounded-[28px] border shadow-xs">
          <div className="border-border border-b px-3 py-3 sm:px-4">
            <StatusTabs
              tabs={statusTabs.map((tab) => tab.value)}
              value={controller.state.activeStatus}
              onChange={(value) => controller.setActiveStatus(value as ProductApprovalStatus)}
              counts={controller.statusCounts}
            />
          </div>

          <div className="border-border border-b px-3 py-3 sm:px-4">
            <TableToolbar
              search={controller.state.search}
              onSearchChange={controller.setSearch}
              placeholder={searchPlaceholder}
            />
          </div>

          <ModerationTable
            items={controller.filteredItems}
            selectedIds={controller.state.selectedIds}
            allVisibleSelected={controller.allVisibleSelected}
            onToggleAll={controller.toggleAllVisible}
            onToggleSelected={controller.toggleSelected}
            onOpenDetail={controller.openDetail}
          />

          {controller.filteredItems.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <Typography variant="body-sm" className="text-muted-foreground">
                No listings found.
              </Typography>
            </div>
          ) : null}
        </div>

        <SelectionBar
          count={controller.state.selectedIds.length}
          approveLabel={approveLabel}
          rejectLabel={rejectLabel}
          onApprove={() => controller.openAction('approve', controller.state.selectedIds)}
          onReject={() => controller.openAction('reject', controller.state.selectedIds)}
        />
      </div>

      <Sheet open={controller.state.sheetOpen} onOpenChange={controller.setSheetOpen}>
        <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-[34rem]">
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
