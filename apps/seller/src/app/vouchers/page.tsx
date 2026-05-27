'use client'

import { useEffect, useState } from 'react'
import { Vouchers, type VoucherRow } from '@ecom/ui-seller'
import { DashboardLayout } from '../../components/dashboard-layout'
import { getVouchersBundle } from '@/features/integration/seller-page-api'
import { mapCouponsToVoucherRows } from '@/features/integration/seller-page-adapters'

export default function VouchersPage() {
  const [rows, setRows] = useState<VoucherRow[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const coupons = await getVouchersBundle()
      setRows(mapCouponsToVoucherRows(coupons))
    }

    void fetchData()
  }, [])

  return (
    <DashboardLayout>
      <Vouchers
        newVoucherHref="/vouchers/new"
        vouchers={rows}
        emptyMessage="No vouchers available yet."
      />
    </DashboardLayout>
  )
}
