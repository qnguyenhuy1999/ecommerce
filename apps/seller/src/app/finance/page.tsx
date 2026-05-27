'use client'

import { useEffect, useState } from 'react'
import { Finance, type FinanceProps } from '@ecom/ui-seller'
import { DashboardLayout } from '../../components/dashboard-layout'
import { getFinanceBundle } from '@/features/integration/seller-page-api'
import { buildFinanceProps } from '@/features/integration/seller-page-adapters'

export default function FinancePage() {
  const [props, setProps] = useState<FinanceProps>()

  useEffect(() => {
    const fetchData = async () => {
      const bundle = await getFinanceBundle()
      setProps(buildFinanceProps(bundle))
    }

    void fetchData()
  }, [])

  return (
    <DashboardLayout>
      {props ? (
        <Finance {...props} />
      ) : (
        <p className="p-6 text-sm text-gray-500">Loading finance...</p>
      )}
    </DashboardLayout>
  )
}
