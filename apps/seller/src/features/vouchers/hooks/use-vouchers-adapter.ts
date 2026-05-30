'use client'

import { useQuery } from '@tanstack/react-query'
import { getVouchersBundle } from '../api'
import { mapCouponsToVoucherRows } from '../mappers'
import { voucherKeys } from '../query-keys'

export function useVouchersAdapter(initialData?: ReturnType<typeof mapCouponsToVoucherRows>) {
  const query = useQuery({
    queryKey: voucherKeys.bundle(),
    queryFn: async () => {
      const coupons = await getVouchersBundle()
      return mapCouponsToVoucherRows(coupons)
    },
    initialData,
  })

  return {
    loading: query.isPending,
    error: query.error,
    vouchers: query.data ?? [],
  }
}
