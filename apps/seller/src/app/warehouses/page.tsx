'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Warehouses } from '@ecom/ui-seller'
import { DashboardLayout } from '../../components/dashboard-layout'

export default function WarehousesPage() {
  const router = useRouter()

  const handleCreateClick = useCallback(() => {
    router.push('/warehouses/new')
  }, [router])

  return (
    <DashboardLayout>
      <Warehouses onCreateClick={handleCreateClick} />
    </DashboardLayout>
  )
}
