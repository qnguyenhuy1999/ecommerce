'use client'

import { useEffect, useState } from 'react'
import { Finance, type FinanceProps } from '@ecom/ui-seller'
import { getFinanceBundle } from '@/features/finance/api'
import { buildFinanceProps } from '@/features/finance/mappers'

export default function FinancePage() {
  const [props, setProps] = useState<FinanceProps>()

  useEffect(() => {
    const fetchData = async () => {
      const bundle = await getFinanceBundle()
      setProps(buildFinanceProps(bundle))
    }

    void fetchData()
  }, [])

  return props ? (
    <Finance {...props} />
  ) : (
    <p className="p-6 text-sm text-gray-500">Loading finance...</p>
  )
}
