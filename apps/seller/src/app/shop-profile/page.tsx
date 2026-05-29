'use client'

import { useEffect, useState } from 'react'
import { ShopProfile, type ShopProfileFormData } from '@ecom/ui-seller'
import { DashboardLayout } from '../../shared/components/dashboard-layout'
import { getShopProfile, updateShopProfile } from '@/features/shop-profile/api'
import {
  mapProfileFormToUpdateShopPayload,
  mapShopToProfileForm,
} from '@/features/shop-profile/mappers'

export default function ShopProfilePage() {
  const [formData, setFormData] = useState<ShopProfileFormData>()

  useEffect(() => {
    const fetchData = async () => {
      const shop = await getShopProfile()
      setFormData(mapShopToProfileForm(shop))
    }

    void fetchData()
  }, [])

  const handleSubmit = async (data: ShopProfileFormData) => {
    await updateShopProfile(mapProfileFormToUpdateShopPayload(data))
    setFormData(data)
  }

  return (
    <DashboardLayout>
      {formData ? (
        <ShopProfile
          breadcrumb={[{ label: 'Seller', href: '/' }, { label: 'Shop profile' }]}
          initialData={formData}
          onSubmit={handleSubmit}
          countryOptions={['VN', 'SG', 'MY', 'TH', 'ID']}
          responseTargetOptions={['within 1 hour', 'within 4 hours', 'within 24 hours']}
        />
      ) : (
        <p className="p-6 text-sm text-gray-500">Loading shop profile...</p>
      )}
    </DashboardLayout>
  )
}
