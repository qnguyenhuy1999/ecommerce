'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Warehouses, type WarehouseRow } from '@ecom/ui-seller'
import { getWarehouses } from '@/features/integration/seller-page-api'
import { DashboardLayout } from '../../components/dashboard-layout'

export default function WarehousesPage() {
  const router = useRouter()
  const [warehouses, setWarehouses] = useState<WarehouseRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        setWarehouses(await getWarehouses())
      } catch {
        setWarehouses([])
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
