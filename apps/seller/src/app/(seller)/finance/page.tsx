'use client'

import { Finance } from '@ecom/ui-seller/pages/Finance'
import { useFinanceAdapter } from '@/features/finance/hooks/use-finance-adapter'

export default function FinancePage() {
  const { props } = useFinanceAdapter()

  return props ? (
    <Finance {...props} />
  ) : (
    <p className="p-6 text-sm text-gray-500">Loading finance...</p>
  )
}
