'use client'

import { useEffect, useState } from 'react'
import { Vouchers, type VoucherRow } from '@ecom/ui-seller'
import { DashboardLayout } from '../../shared/components/dashboard-layout'
import { getVouchersBundle } from '@/features/vouchers/api'
import { mapCouponsToVoucherRows } from '@/features/vouchers/mappers'

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
