import { BadgeCheck, Truck, ShieldCheck, RotateCcw, Lock } from 'lucide-react'

import { cn } from '@ecom/ui'

// ─── Server: trust badge (trust state is static) ─────────────────────────────
export type TrustBadgeType =
  | 'verified-seller'
  | 'free-shipping'
  | 'secure-checkout'
  | 'free-returns'
  | 'authentic'

export interface TrustBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  type: TrustBadgeType
  label?: string
  size?: 'sm' | 'default'
}

const trustConfig: Record<TrustBadgeType, { icon: React.ElementType; label: string; iconColor: string }> = {
  'verified-seller': { icon: BadgeCheck, label: 'Verified Seller', iconColor: 'text-info' },
  'free-shipping': { icon: Truck, label: 'Free Shipping', iconColor: 'text-success' },
  'secure-checkout': { icon: Lock, label: 'Secure Checkout', iconColor: 'text-[var(--brand-500)]' },
  'free-returns': { icon: RotateCcw, label: 'Free Returns', iconColor: 'text-info' },
  authentic: { icon: ShieldCheck, label: '100% Authentic', iconColor: 'text-success' },
}

function TrustBadge({ type, label, size = 'default', className, ...props }: TrustBadgeProps) {
  const config = trustConfig[type]
  const Icon = config.icon

  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
  const textSize = size === 'sm' ? 'text-[length:var(--text-micro)]' : 'text-[var(--text-sm)]'

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5',
        textSize,
        'font-medium text-muted-foreground',
        className,
      )}
      {...props}
    >
      <Icon className={cn(iconSize, 'shrink-0', config.iconColor)} />
      <span>{label ?? config.label}</span>
    </div>
  )
}

// ─── TrustBadgeGroup ─────────────────────────────────────────────────────────
export interface TrustBadgeGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  types: TrustBadgeType[]
  size?: 'sm' | 'default'
  separator?: 'dot' | 'pipe' | 'none'
}

function TrustBadgeGroup({
  types,
  size = 'default',
  separator = 'dot',
  className,
  ...props
}: TrustBadgeGroupProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-x-3 gap-y-1', className)} {...props}>
      {types.map((type, i) => (
        <div key={type} className="flex items-center gap-1.5">
          <TrustBadge type={type} size={size} />
          {separator === 'dot' && i < types.length - 1 && (
            <span className="text-muted-foreground/40 text-xs select-none">·</span>
          )}
          {separator === 'pipe' && i < types.length - 1 && (
            <span className="text-muted-foreground/40 text-xs select-none">|</span>
          )}
        </div>
      ))}
    </div>
  )
}

export { TrustBadge, TrustBadgeGroup }
