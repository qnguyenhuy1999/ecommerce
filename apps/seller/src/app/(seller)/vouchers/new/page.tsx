'use client'

import { useRouter } from 'next/navigation'
import { VoucherDetail, type VoucherDetailFormData } from '@ecom/ui-seller'
import { createVoucher } from '@/features/vouchers/api'
import { mapVoucherFormToCreateCouponPayload } from '@/features/vouchers/mappers'

export default function NewVoucherPage() {
  const router = useRouter()

  const handleSubmit = async (data: VoucherDetailFormData) => {
    await createVoucher(mapVoucherFormToCreateCouponPayload(data))
    router.push('/vouchers')
  }

  return (
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
  )
}
