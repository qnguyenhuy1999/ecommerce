'use client'

import { useRouter } from 'next/navigation'
import { VoucherDetail, type VoucherDetailFormData } from '@ecom/ui-seller'
import { DashboardLayout } from '../../../components/dashboard-layout'
import { createVoucher } from '@/features/integration/seller-page-api'
import { mapVoucherFormToCreateCouponPayload } from '@/features/integration/seller-page-adapters'

export default function NewVoucherPage() {
  const router = useRouter()

  const handleSubmit = async (data: VoucherDetailFormData) => {
    await createVoucher(mapVoucherFormToCreateCouponPayload(data))
    router.push('/vouchers')
  }

  return (
    <DashboardLayout>
      <VoucherDetail
        breadcrumb={[
          { label: 'Seller', href: '/' },
          { label: 'Vouchers', href: '/vouchers' },
          { label: 'New' },
        ]}
        cancelHref="/vouchers"
        onSubmit={(data) => {
          void handleSubmit(data)
        }}
      />
    </DashboardLayout>
  )
}
