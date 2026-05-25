'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Warehouses, type WarehouseRow } from '@ecom/ui-seller'
import { DashboardLayout } from '../../components/dashboard-layout'
import { api } from '../../lib/api'

interface WarehousesResponse {
  data: WarehouseRow[]
}

export default function WarehousesPage() {
  const router = useRouter()
  const [warehouses, setWarehouses] = useState<WarehouseRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await api<WarehousesResponse>('/warehouses')
        setWarehouses(res.data)
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }
    void fetch()
  }, [])

  const handleCreateClick = useCallback(() => {
    router.push('/warehouses/new')
  }, [router])

  return (
    <DashboardLayout>
      <Warehouses warehouses={warehouses} loading={loading} onCreateClick={handleCreateClick} />
    </DashboardLayout>
  )
}
