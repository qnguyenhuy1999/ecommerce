'use client'

import { ReturnsRefunds } from '@ecom/ui-seller'
import { useReturnsAdapter } from '@/features/returns/hooks/use-returns-adapter'

export default function ReturnsPage() {
  const { loading, returns, onAction } = useReturnsAdapter()

  return <ReturnsRefunds returns={returns} onAction={onAction} />
}
