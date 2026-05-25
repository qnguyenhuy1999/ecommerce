'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/dashboard-layout'
import { api } from '../../lib/api'
import { ReturnsRefunds } from '@ecom/ui-seller'
import type { ReturnRow, ReturnsRefundsActionPayload } from '@ecom/ui-seller'

interface ApiReturnItem {
  id: string
  variantId: string
  quantity: number
}

interface ApiReturn {
  id: string
  orderId: string
  reason: string
  status: string
  refundAmount: number
  createdAt: string
  items: ApiReturnItem[]
  buyer?: { name?: string }
}

interface ReturnsResponse {
  data: ApiReturn[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

function mapStatus(status: string): ReturnRow['status'] {
  const allowed = ['OPEN', 'APPROVED', 'REFUNDED', 'REJECTED'] as const
  return (allowed as readonly string[]).includes(status) ? (status as ReturnRow['status']) : 'OPEN'
}

function toReturnRow(r: ApiReturn): ReturnRow {
  return {
    id: r.id,
    caseId: r.id.slice(0, 8).toUpperCase(),
    orderNumber: r.orderId.slice(0, 8).toUpperCase(),
    buyerName: r.buyer?.name ?? '—',
    reason: r.reason.replace(/_/g, ' '),
    amount: Number(r.refundAmount),
    status: mapStatus(r.status),
    openedAtLabel: new Date(r.createdAt).toLocaleDateString(),
  }
}

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnRow[]>([])

  const fetchReturns = async () => {
    try {
      const res = await api<ReturnsResponse>('/returns', {
        params: { page: 1, limit: 100 },
      })
      setReturns(res.data.map(toReturnRow))
    } catch {
      /* empty */
    }
  }

  useEffect(() => {
    void fetchReturns()
  }, [])

  const handleAction = async (payload: ReturnsRefundsActionPayload) => {
    const statusMap: Record<ReturnsRefundsActionPayload['action'], string> = {
      approve: 'APPROVED',
      partial: 'APPROVED',
      reject: 'REJECTED',
    }
    await api(`/returns/${payload.id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: statusMap[payload.action] }),
    })
    void fetchReturns()
  }

  return (
    <DashboardLayout>
      <ReturnsRefunds returns={returns} onAction={handleAction} />
    </DashboardLayout>
  )
}
