'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { WarehouseDetail } from '@ecom/ui-seller/pages/WarehouseDetail'
import { createWarehouse } from '@/features/warehouses/api'
import type { WarehouseFormValues } from '@ecom/ui-seller/pages/WarehouseDetail'

export function NewWarehousePageClient() {
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

  return <WarehouseDetail onSubmit={handleSubmit} onCancel={handleCancel} isLoading={loading} />
}
