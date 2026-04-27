'use client'

import React from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { adminSellerClient } from '@ecom/api-client'
import type { AdminSellerDetail, AdminSellerSummary } from '@ecom/api-types'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@ecom/ui'
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableColumn,
  DataTableEmpty,
  DataTableHeader,
  DataTableRow,
  StatusBadge,
} from '@ecom/ui-admin'

import { AdminShell } from '@/components/admin-shell'

type KycStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

const KYC_STATUSES: KycStatus[] = ['PENDING', 'APPROVED', 'REJECTED']

const STATUS_TO_BADGE: Record<KycStatus, 'pending' | 'delivered' | 'cancelled'> = {
  PENDING: 'pending',
  APPROVED: 'delivered',
  REJECTED: 'cancelled',
}

const STATUS_LABEL: Record<KycStatus, string> = {
  PENDING: 'Pending review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
}

interface Filters {
  kycStatus: KycStatus | 'ALL'
  search: string
}

const INITIAL_FILTERS: Filters = { kycStatus: 'PENDING', search: '' }

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return iso
  }
}

export default function SellersPage() {
  const [filters, setFilters] = React.useState<Filters>(INITIAL_FILTERS)
  const [page, setPage] = React.useState(1)
  const [activeSellerId, setActiveSellerId] = React.useState<string | null>(null)
  const [reviewMode, setReviewMode] = React.useState<'view' | 'reject'>('view')
  const limit = 20

  const queryParams = React.useMemo(
    () => ({
      page,
      limit,
      kycStatus: filters.kycStatus !== 'ALL' ? filters.kycStatus : undefined,
      search: filters.search.trim() || undefined,
    }),
    [filters, page],
  )

  const list = useQuery({
    queryKey: ['admin-sellers', queryParams],
    queryFn: () => adminSellerClient.list(queryParams),
  })

  const sellers = list.data?.data ?? []
  const total = list.data?.meta.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <AdminShell title="Sellers">
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Seller approvals</h1>
          <p className="text-[var(--text-secondary)]">
            Review KYC submissions and decide on access to the marketplace.
          </p>
        </header>

        <FiltersBar
          filters={filters}
          onChange={(next) => {
            setFilters(next)
            setPage(1)
          }}
        />

        <DataTable card title="Seller queue" totalRows={total}>
          <DataTableHeader>
            <DataTableRow>
              <DataTableColumn>Store</DataTableColumn>
              <DataTableColumn>Owner</DataTableColumn>
              <DataTableColumn>Submitted</DataTableColumn>
              <DataTableColumn align="right">Commission</DataTableColumn>
              <DataTableColumn>Status</DataTableColumn>
              <DataTableColumn align="right">Actions</DataTableColumn>
            </DataTableRow>
          </DataTableHeader>
          <DataTableBody>
            {list.isLoading ? (
              <DataTableEmpty colSpan={6}>Loading sellers…</DataTableEmpty>
            ) : list.isError ? (
              <DataTableEmpty colSpan={6}>Failed to load sellers. Try again.</DataTableEmpty>
            ) : sellers.length === 0 ? (
              <DataTableEmpty colSpan={6}>No sellers match the current filters.</DataTableEmpty>
            ) : (
              sellers.map((seller) => (
                <SellerRow
                  key={seller.id}
                  seller={seller}
                  onReview={(mode) => {
                    setActiveSellerId(seller.id)
                    setReviewMode(mode)
                  }}
                />
              ))
            )}
          </DataTableBody>
        </DataTable>

        {total > limit && (
          <div className="flex items-center justify-end gap-3">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-[var(--text-secondary)]">
              Page {page} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <SellerReviewDialog
        sellerId={activeSellerId}
        mode={reviewMode}
        onClose={() => setActiveSellerId(null)}
        onSwitchMode={setReviewMode}
      />
    </AdminShell>
  )
}

function FiltersBar({
  filters,
  onChange,
}: {
  filters: Filters
  onChange: (next: Filters) => void
}) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <div className="space-y-1">
        <Label htmlFor="kycStatus">KYC status</Label>
        <Select
          value={filters.kycStatus}
          onValueChange={(value) =>
            onChange({ ...filters, kycStatus: value as Filters['kycStatus'] })
          }
        >
          <SelectTrigger id="kycStatus">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            {KYC_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {STATUS_LABEL[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1 md:col-span-2">
        <Label htmlFor="search">Search store / email</Label>
        <Input
          id="search"
          placeholder="Mountain Outfitters, jane@…"
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
        />
      </div>
    </div>
  )
}

function SellerRow({
  seller,
  onReview,
}: {
  seller: AdminSellerSummary
  onReview: (mode: 'view' | 'reject') => void
}) {
  const status = seller.kycStatus as KycStatus
  return (
    <DataTableRow rowKey={seller.id}>
      <DataTableCell className="font-semibold">{seller.storeName}</DataTableCell>
      <DataTableCell muted>{seller.ownerEmail}</DataTableCell>
      <DataTableCell muted>{formatDate(seller.submittedAt)}</DataTableCell>
      <DataTableCell align="right" className="tabular-nums">
        {(seller.commissionRate * 100).toFixed(1)}%
      </DataTableCell>
      <DataTableCell>
        <StatusBadge status={STATUS_TO_BADGE[status]} label={STATUS_LABEL[status]} />
      </DataTableCell>
      <DataTableCell align="right">
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => onReview('view')}>
            Review
          </Button>
          {status === 'PENDING' && (
            <Button size="sm" variant="outline" onClick={() => onReview('reject')}>
              Reject
            </Button>
          )}
        </div>
      </DataTableCell>
    </DataTableRow>
  )
}

function SellerReviewDialog({
  sellerId,
  mode,
  onClose,
  onSwitchMode,
}: {
  sellerId: string | null
  mode: 'view' | 'reject'
  onClose: () => void
  onSwitchMode: (mode: 'view' | 'reject') => void
}) {
  const queryClient = useQueryClient()
  const [reason, setReason] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)

  const detail = useQuery({
    queryKey: ['admin-seller', sellerId],
    queryFn: () => adminSellerClient.getById(sellerId as string),
    enabled: !!sellerId,
  })

  React.useEffect(() => {
    setReason('')
    setError(null)
  }, [sellerId, mode])

  const invalidate = React.useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['admin-sellers'] })
    if (sellerId) {
      void queryClient.invalidateQueries({ queryKey: ['admin-seller', sellerId] })
    }
  }, [queryClient, sellerId])

  const approve = useMutation({
    mutationFn: () => adminSellerClient.approve(sellerId as string),
    onSuccess: () => {
      invalidate()
      onClose()
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to approve seller.'),
  })

  const reject = useMutation({
    mutationFn: () =>
      adminSellerClient.reject(sellerId as string, {
        reason: reason.trim() || undefined,
      }),
    onSuccess: () => {
      invalidate()
      onClose()
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to reject seller.'),
  })

  const data = detail.data
  const isPending = approve.isPending || reject.isPending
  const isPendingKyc = data?.kycStatus === 'PENDING'

  return (
    <Dialog open={!!sellerId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{data ? data.storeName : 'Seller review'}</DialogTitle>
          <DialogDescription>
            Review KYC documents and decide on marketplace access.
          </DialogDescription>
        </DialogHeader>

        {detail.isLoading && <p>Loading…</p>}
        {detail.isError && <p>Failed to load seller detail.</p>}

        {data && (
          <div className="space-y-4">
            <SellerInfoPanel detail={data} />

            {mode === 'reject' && isPendingKyc && (
              <section className="space-y-2 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-secondary)] p-3">
                <Label htmlFor="reject-reason">Reason for rejection (optional)</Label>
                <Textarea
                  id="reject-reason"
                  rows={3}
                  placeholder="Share context the seller can act on…"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  maxLength={1000}
                />
                <p className="text-[length:var(--text-xs)] text-[var(--text-tertiary)]">
                  Captured in the audit trail and dispatched to the seller.
                </p>
              </section>
            )}

            {error && <p className="text-sm text-[var(--error-600)]">{error}</p>}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Close
          </Button>
          {data && isPendingKyc && (
            <>
              {mode === 'view' ? (
                <>
                  <Button variant="outline" onClick={() => onSwitchMode('reject')}>
                    Reject…
                  </Button>
                  <Button onClick={() => approve.mutate()} disabled={isPending}>
                    Approve
                  </Button>
                </>
              ) : (
                <Button variant="destructive" onClick={() => reject.mutate()} disabled={isPending}>
                  Confirm rejection
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SellerInfoPanel({ detail }: { detail: AdminSellerDetail }) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">Owner</p>
          <p className="font-medium">{detail.ownerEmail}</p>
        </div>
        <StatusBadge
          status={STATUS_TO_BADGE[detail.kycStatus as KycStatus]}
          label={STATUS_LABEL[detail.kycStatus as KycStatus]}
        />
      </div>

      <dl className="grid gap-2 text-sm md:grid-cols-2">
        <div>
          <dt className="text-[var(--text-secondary)]">Submitted</dt>
          <dd>{formatDate(detail.submittedAt)}</dd>
        </div>
        <div>
          <dt className="text-[var(--text-secondary)]">Commission rate</dt>
          <dd>{(detail.commissionRate * 100).toFixed(1)}%</dd>
        </div>
        <div>
          <dt className="text-[var(--text-secondary)]">Business registration</dt>
          <dd className="font-mono">{detail.businessRegistrationNumber ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-[var(--text-secondary)]">Bank</dt>
          <dd className="font-mono">
            {detail.bankCode ?? '—'} · {detail.bankAccountNumber ?? '—'}
          </dd>
        </div>
      </dl>

      {detail.storeDescription && (
        <div>
          <p className="text-sm text-[var(--text-secondary)]">Store description</p>
          <p>{detail.storeDescription}</p>
        </div>
      )}

      {detail.kycDocuments && Object.keys(detail.kycDocuments).length > 0 && (
        <div className="space-y-1">
          <p className="text-sm text-[var(--text-secondary)]">KYC documents</p>
          <pre className="overflow-x-auto rounded-[var(--radius-sm)] bg-[var(--surface-secondary)] p-2 text-[length:var(--text-xs)]">
            {JSON.stringify(detail.kycDocuments, null, 2)}
          </pre>
        </div>
      )}
    </section>
  )
}
