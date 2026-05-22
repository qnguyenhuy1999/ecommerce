'use client'

import { Sheet, SheetContent } from '@ecom/core-ui'
import { startTransition, useCallback, useDeferredValue, useMemo, useState } from 'react'
import { useControllableState } from '../../hooks'
import { SellerListPage } from '../../organisms/SellerListPage'
import { createReturnsColumns } from './ReturnsRefunds.columns'
import { buildReturnActionPayload, buildReturnStatusCounts } from './ReturnsRefunds.constants'
import { ApproveReturnModal, ReturnCaseDetail } from './ReturnsRefunds.components'
import { returnsDefaultProps } from './ReturnsRefunds.fixtures'
import type {
  RefundMethod,
  ReturnRow,
  ReturnsRefundsProps,
  ReturnsRefundsStatusTab,
} from './ReturnsRefunds.types'
import { filterReturnsBySearchAndStatus, isReturnsRefundsStatusTab } from './ReturnsRefunds.utils'

interface ReturnsRefundsClientProps {
  returns: ReturnRow[]
  statusTabs?: ReturnsRefundsProps['statusTabs']
  status?: ReturnsRefundsProps['status']
  defaultStatus?: ReturnsRefundsProps['defaultStatus']
  onStatusChange?: ReturnsRefundsProps['onStatusChange']
  statusCounts?: ReturnsRefundsProps['statusCounts']
  searchPlaceholder?: ReturnsRefundsProps['searchPlaceholder']
  emptyMessage?: ReturnsRefundsProps['emptyMessage']
  filterReturns?: ReturnsRefundsProps['filterReturns']
  onAction?: ReturnsRefundsProps['onAction']
  onApprove?: ReturnsRefundsProps['onApprove']
  onPartial?: ReturnsRefundsProps['onPartial']
  onReject?: ReturnsRefundsProps['onReject']
}

export function ReturnsRefundsClient({
  returns,
  statusTabs = returnsDefaultProps.statusTabs,
  status,
  defaultStatus = returnsDefaultProps.defaultStatus,
  onStatusChange,
  statusCounts,
  searchPlaceholder = returnsDefaultProps.searchPlaceholder,
  emptyMessage = returnsDefaultProps.emptyMessage,
  filterReturns = filterReturnsBySearchAndStatus,
  onAction = returnsDefaultProps.onAction,
  onApprove = returnsDefaultProps.onApprove,
  onPartial = returnsDefaultProps.onPartial,
  onReject = returnsDefaultProps.onReject,
}: ReturnsRefundsClientProps) {
  const [search, setSearch] = useControllableState({
    defaultValue: '',
  })
  const [currentStatus, setCurrentStatus] = useControllableState<ReturnsRefundsStatusTab>({
    defaultValue: defaultStatus,
    ...(status !== undefined ? { value: status } : {}),
    ...(onStatusChange !== undefined ? { onChange: onStatusChange } : {}),
  })
  const [selectedCase, setSelectedCase] = useState<ReturnRow | null>(null)
  const [refundMethod, setRefundMethod] = useState<RefundMethod>('ORIGINAL_PAYMENT')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const deferredSearch = useDeferredValue(search)

  const counts = useMemo(
    () => statusCounts ?? buildReturnStatusCounts(returns),
    [returns, statusCounts],
  )
  const filteredReturns = useMemo(
    () => filterReturns({ returns, search: deferredSearch, status: currentStatus }),
    [currentStatus, deferredSearch, filterReturns, returns],
  )

  const dispatchAction = useCallback(
    async (...args: Parameters<NonNullable<ReturnsRefundsProps['onAction']>>) => {
      await Promise.resolve(onAction?.(...args))
    },
    [onAction],
  )

  const handleSelectCase = useCallback((row: (typeof returns)[number]) => {
    setSelectedCase(row)
    setRefundMethod('ORIGINAL_PAYMENT')
    setSheetOpen(true)
  }, [])

  const closeApproveDialog = useCallback(() => {
    setApproveDialogOpen(false)
  }, [])

  const handleApproveRequest = useCallback(() => {
    setApproveDialogOpen(true)
  }, [])

  const handleApproveConfirm = useCallback(() => {
    if (!selectedCase) {
      return
    }

    void dispatchAction(buildReturnActionPayload('approve', selectedCase, refundMethod))
    onApprove(selectedCase.id, refundMethod)
    setApproveDialogOpen(false)
    setSheetOpen(false)
  }, [dispatchAction, onApprove, refundMethod, selectedCase])

  const handlePartial = useCallback(() => {
    if (!selectedCase) {
      return
    }

    void dispatchAction(buildReturnActionPayload('partial', selectedCase, refundMethod))
    onPartial(selectedCase.id, refundMethod)
    setSheetOpen(false)
  }, [dispatchAction, onPartial, refundMethod, selectedCase])

  const handleReject = useCallback(() => {
    if (!selectedCase) {
      return
    }

    void dispatchAction(buildReturnActionPayload('reject', selectedCase, refundMethod))
    onReject(selectedCase.id)
    setSheetOpen(false)
  }, [dispatchAction, onReject, refundMethod, selectedCase])

  const columns = useMemo(() => createReturnsColumns(handleSelectCase), [handleSelectCase])

  return (
    <>
      <SellerListPage.Table
        columns={columns}
        data={filteredReturns}
        onRowClick={handleSelectCase}
        toolbar={
          <SellerListPage.Filters>
            <SellerListPage.Search
              value={search}
              onChange={(value) => {
                startTransition(() => {
                  setSearch(value)
                })
              }}
              placeholder={searchPlaceholder}
            />
            <SellerListPage.StatusTabs
              tabs={statusTabs}
              value={currentStatus}
              onChange={(tab) => {
                if (isReturnsRefundsStatusTab(tab)) {
                  startTransition(() => {
                    setCurrentStatus(tab)
                  })
                }
              }}
              counts={counts}
            />
          </SellerListPage.Filters>
        }
        emptyMessage={emptyMessage}
      />

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full max-w-md overflow-y-auto px-4">
          {selectedCase ? (
            <ReturnCaseDetail
              row={selectedCase}
              refundMethod={refundMethod}
              onRefundMethodChange={setRefundMethod}
              onApprove={handleApproveRequest}
              onPartial={handlePartial}
              onReject={handleReject}
            />
          ) : null}
        </SheetContent>
      </Sheet>

      <ApproveReturnModal
        open={approveDialogOpen}
        row={selectedCase}
        refundMethod={refundMethod}
        onClose={closeApproveDialog}
        onConfirm={handleApproveConfirm}
      />
    </>
  )
}
