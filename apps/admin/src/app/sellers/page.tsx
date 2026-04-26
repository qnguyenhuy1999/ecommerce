'use client'

import React from 'react'

import { Button } from '@ecom/ui'

import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableColumn,
  DataTableHeader,
  DataTableRow,
  StatusBadge,
} from '@ecom/ui-admin'

import { AdminShell } from '@/components/admin-shell'

interface SellerRow {
  id: string
  storeName: string
  ownerEmail: string
  submittedAt: string
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
  commissionRate: number
}

/**
 * Mock seller approval queue. Backed by typed data so the same component will
 * drop in once `sellerClient.list({ status: 'PENDING' })` is wired up.
 */
const SELLERS: SellerRow[] = [
  {
    id: 'sel_01',
    storeName: 'Mountain Outfitters',
    ownerEmail: 'jane@mountain-outfitters.co',
    submittedAt: '2026-04-22',
    kycStatus: 'PENDING',
    commissionRate: 0.1,
  },
  {
    id: 'sel_02',
    storeName: 'Aurora Skincare',
    ownerEmail: 'team@auroraskin.com',
    submittedAt: '2026-04-21',
    kycStatus: 'PENDING',
    commissionRate: 0.12,
  },
  {
    id: 'sel_03',
    storeName: 'Coastal Audio',
    ownerEmail: 'hello@coastalaudio.io',
    submittedAt: '2026-04-19',
    kycStatus: 'APPROVED',
    commissionRate: 0.08,
  },
  {
    id: 'sel_04',
    storeName: 'Late Bloomers Co.',
    ownerEmail: 'support@latebloomers.co',
    submittedAt: '2026-04-18',
    kycStatus: 'REJECTED',
    commissionRate: 0.1,
  },
]

const STATUS_TO_BADGE: Record<SellerRow['kycStatus'], 'pending' | 'delivered' | 'cancelled'> = {
  PENDING: 'pending',
  APPROVED: 'delivered',
  REJECTED: 'cancelled',
}

const STATUS_LABEL: Record<SellerRow['kycStatus'], string> = {
  PENDING: 'Pending review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
}

export default function SellersPage() {
  return (
    <AdminShell title="Sellers">
      <div className="space-y-[var(--space-6)]">
        <header className="space-y-[var(--space-1)]">
          <h1 className="text-[length:var(--text-2xl)] font-bold tracking-tight">
            Seller approvals
          </h1>
          <p className="text-[var(--text-secondary)]">
            Review KYC submissions and decide on access to the marketplace.
          </p>
        </header>

        <DataTable card title="Seller queue" totalRows={SELLERS.length}>
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
            {SELLERS.map((seller) => (
              <DataTableRow key={seller.id} rowKey={seller.id}>
                <DataTableCell className="font-semibold">{seller.storeName}</DataTableCell>
                <DataTableCell muted>{seller.ownerEmail}</DataTableCell>
                <DataTableCell muted>{seller.submittedAt}</DataTableCell>
                <DataTableCell align="right" className="tabular-nums">
                  {(seller.commissionRate * 100).toFixed(1)}%
                </DataTableCell>
                <DataTableCell>
                  <StatusBadge status={STATUS_TO_BADGE[seller.kycStatus]} label={STATUS_LABEL[seller.kycStatus]} />
                </DataTableCell>
                <DataTableCell align="right">
                  {seller.kycStatus === 'PENDING' ? (
                    <div className="flex justify-end gap-[var(--space-2)]">
                      <Button size="sm" variant="outline">
                        Reject
                      </Button>
                      <Button size="sm">Approve</Button>
                    </div>
                  ) : (
                    <span className="text-[length:var(--text-sm)] text-[var(--text-tertiary)]">—</span>
                  )}
                </DataTableCell>
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      </div>
    </AdminShell>
  )
}
