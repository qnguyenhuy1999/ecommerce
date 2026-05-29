'use client'

import { useEffect, useState } from 'react'
import { Vouchers, type VoucherRow } from '@ecom/ui-seller'
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
    <Vouchers
      newVoucherHref="/vouchers/new"
      vouchers={rows}
      emptyMessage="No vouchers available yet."
    />
  )
}
