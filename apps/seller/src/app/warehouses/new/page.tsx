'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { WarehouseDetail } from '@ecom/ui-seller'
import { DashboardLayout } from '../../../components/dashboard-layout'
import { api } from '../../../lib/api'
import type { SellerPaths } from '@ecom/contracts/generated'
import type { WarehouseFormValues } from '@ecom/ui-seller'

type CreateWarehouseResponse =
  SellerPaths['/warehouses']['post']['responses']['201']['content']['application/json']

export default function NewWarehousePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(
    async (values: WarehouseFormValues) => {
      setLoading(true)
      try {
        await api<CreateWarehouseResponse>('/warehouses', {
          method: 'POST',
          body: JSON.stringify(values),
        })
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
