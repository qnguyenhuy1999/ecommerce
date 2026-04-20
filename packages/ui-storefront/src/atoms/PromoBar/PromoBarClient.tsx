'use client'

import { X } from 'lucide-react'

// ─── Client leaf: dismiss functionality ──────────────────────────────────────
interface PromoBarClientProps {
  onDismiss: () => void
}

export function PromoBarClient({ onDismiss }: PromoBarClientProps) {
  return (
    <button
      type="button"
      onClick={onDismiss}
      aria-label="Dismiss promotion"
      className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-all"
    >
      <X className="w-4 h-4" />
    </button>
  )
}
