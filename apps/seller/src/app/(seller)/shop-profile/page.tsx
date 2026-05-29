'use client'

import { ShopProfile } from '@ecom/ui-seller'
import { useShopProfileAdapter } from '@/features/shop-profile/hooks/use-shop-profile-adapter'

export default function ShopProfilePage() {
  const { loading, formData, onSubmit } = useShopProfileAdapter()

  return formData ? (
    <ShopProfile
      breadcrumb={[{ label: 'Seller', href: '/' }, { label: 'Shop profile' }]}
      initialData={formData}
      onSubmit={onSubmit}
      countryOptions={['VN', 'SG', 'MY', 'TH', 'ID']}
      responseTargetOptions={['within 1 hour', 'within 4 hours', 'within 24 hours']}
    />
  ) : (
    <p className="p-6 text-sm text-gray-500">Loading shop profile...</p>
  )
}
