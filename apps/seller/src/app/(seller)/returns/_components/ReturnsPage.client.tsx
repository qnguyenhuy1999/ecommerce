'use client'

import { ReturnsRefunds } from '@ecom/ui-seller/pages/ReturnsRefunds'
import { useReturnsAdapter } from '@/features/returns/hooks/use-returns-adapter'

export function ReturnsPageClient() {
  const { returns, onAction } = useReturnsAdapter()

  return <ReturnsRefunds returns={returns} onAction={onAction} />
}
