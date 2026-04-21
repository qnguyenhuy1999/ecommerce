'use client'

import { BadgeCheck, Truck, ShieldCheck, RotateCcw, Lock } from 'lucide-react'

// ─── Client leaf: animated trust badge ─────────────────────────────────────
export type TrustBadgeType =
  | 'verified-seller'
  | 'free-shipping'
  | 'secure-checkout'
  | 'free-returns'
  | 'authentic'

const trustConfig: Record<
  TrustBadgeType,
  { icon: React.ElementType; label: string; iconColor: string }
> = {
  'verified-seller': { icon: BadgeCheck, label: 'Verified Seller', iconColor: 'text-info' },
  'free-shipping': { icon: Truck, label: 'Free Shipping', iconColor: 'text-success' },
  'secure-checkout': { icon: Lock, label: 'Secure Checkout', iconColor: 'text-[var(--brand-500)]' },
  'free-returns': { icon: RotateCcw, label: 'Free Returns', iconColor: 'text-info' },
  authentic: { icon: ShieldCheck, label: '100% Authentic', iconColor: 'text-success' },
}

interface TrustBadgeClientProps {
  type: TrustBadgeType
  label?: string
}

export function TrustBadgeClient({ type, label }: TrustBadgeClientProps) {
  const config = trustConfig[type]
  const Icon = config.icon

  return (
    <span className="inline-flex items-center gap-1.5 text-[var(--text-sm)] font-medium text-muted-foreground">
      <Icon className={`w-4 h-4 shrink-0 ${config.iconColor}`} />
      <span>{label ?? config.label}</span>
    </span>
  )
}
