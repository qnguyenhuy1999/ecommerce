'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { WarehouseDetail } from '@ecom/ui-seller'
import { createWarehouse } from '@/features/integration/seller-page-api'
import { DashboardLayout } from '../../../components/dashboard-layout'
import type { WarehouseFormValues } from '@ecom/ui-seller'

export default function NewWarehousePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(
    async (values: WarehouseFormValues) => {
      setLoading(true)
      try {
        await createWarehouse(values)
        router.push('/warehouses')
      } finally {
        setLoading(false)
      }
    },
    [router],
  )

  const handleCancel = useCallback(() => {
    router.push('/warehouses')
  }, [router])

  return (
    <DashboardLayout>
      <WarehouseDetail onSubmit={handleSubmit} onCancel={handleCancel} isLoading={loading} />
    </DashboardLayout>
  )
}
