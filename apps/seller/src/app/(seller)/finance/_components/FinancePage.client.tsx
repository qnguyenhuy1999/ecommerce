'use client'

import { Finance } from '@ecom/ui-seller/pages/Finance'
import { useFinanceAdapter } from '@/features/finance/hooks/use-finance-adapter'

type FinancePageClientProps = { initialData?: Parameters<typeof useFinanceAdapter>[0] }

export function FinancePageClient({ initialData }: FinancePageClientProps) {
  const { props } = useFinanceAdapter(initialData)

  return props ? (
    <Finance {...props} />
  ) : (
    <p className="p-6 text-sm text-gray-500">Loading finance...</p>
  )
}
