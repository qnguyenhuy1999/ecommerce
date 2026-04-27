import { ArrowLeft } from 'lucide-react'

import { Breadcrumb, Button } from '@ecom/ui'
import type { BreadcrumbItem } from '@ecom/ui'

export interface OrderDetailBreadcrumbBarProps {
  items: BreadcrumbItem[]
  onBack?: () => void
}

export function OrderDetailBreadcrumbBar({ items, onBack }: OrderDetailBreadcrumbBarProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <Breadcrumb items={items} />
      {onBack && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="-mr-2 gap-1 text-[length:var(--text-xs)] text-[var(--text-secondary)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Orders
        </Button>
      )}
    </div>
  )
}
