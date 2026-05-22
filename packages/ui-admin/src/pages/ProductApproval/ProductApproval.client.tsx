'use client'

import { Button, DataTable, Sheet, SheetContent, StatusTabs, TableToolbar } from '@ecom/core-ui'
import { useMemo } from 'react'
import { buildProductApprovalColumns } from './ProductApproval.columns'
import { ProductApprovalDetailSheet, ProductApprovalModal } from './ProductApproval.components'
import { useProductApprovalController } from './ProductApproval.controller'
import type { ProductApprovalClientProps } from './ProductApproval.types'

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
  const columns = useMemo(() => buildProductApprovalColumns(), [])

  return (
    <>
      <div className="space-y-4">
        <StatusTabs
          tabs={statusTabs.map((tab) => tab.value)}
          value={controller.state.activeStatus}
          onChange={controller.setActiveStatus}
          counts={controller.statusCounts}
        />

        <DataTable
          columns={columns}
          data={controller.filteredItems}
          onRowClick={controller.openDetail}
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
        <SheetContent
          side="right"
          showCloseButton={false}
          className="w-full gap-0 p-0 sm:max-w-4xl"
        >
          <ProductApprovalDetailSheet
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
