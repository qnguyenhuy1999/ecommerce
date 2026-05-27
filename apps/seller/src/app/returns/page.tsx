'use client'

import { useEffect, useState } from 'react'
import { ReturnsRefunds, type ReturnRow, type ReturnsRefundsActionPayload } from '@ecom/ui-seller'
import { getReturns, updateReturnStatus } from '@/features/integration/seller-page-api'
import { mapReturnsToRows } from '@/features/integration/seller-page-adapters'
import { DashboardLayout } from '../../components/dashboard-layout'

const RETURN_ACTION_STATUS_MAP: Record<ReturnsRefundsActionPayload['action'], string> = {
  approve: 'APPROVED',
  partial: 'APPROVED',
  reject: 'REJECTED',
}

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnRow[]>([])

  const refreshReturns = async () => {
    setReturns(mapReturnsToRows(await getReturns()))
  }

  useEffect(() => {
    void refreshReturns()
  }, [])

  const handleAction = async (payload: ReturnsRefundsActionPayload) => {
    await updateReturnStatus(payload.id, RETURN_ACTION_STATUS_MAP[payload.action])
    await refreshReturns()
  }

  return (
    <DashboardLayout>
      <ReturnsRefunds returns={returns} onAction={handleAction} />
    </DashboardLayout>
  )
}
