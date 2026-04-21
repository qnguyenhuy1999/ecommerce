'use client'

import { X } from 'lucide-react'

import { IconButton } from '@ecom/ui'

// ─── Client leaf: dismiss functionality ──────────────────────────────────────
interface PromoBarClientProps {
  onDismiss: () => void
}

export function PromoBarClient({ onDismiss }: PromoBarClientProps) {
  return (
    <IconButton
      type="button"
      onClick={onDismiss}
      icon={<X className="w-4 h-4" />}
      label="Dismiss promotion"
      size="sm"
      className="h-6 w-6 rounded-full hover:bg-white/10 text-white/60 hover:text-white"
    />
  )
}
