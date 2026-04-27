import { MapPin, Star, Pencil, Trash2 } from 'lucide-react'

import { Badge, Button } from '@ecom/ui'
import { cn } from '@ecom/ui/utils'

import type { ShippingAddress } from '../AddressForm/AddressForm'

export interface AddressCardProps {
  address: ShippingAddress
  isDefault?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onSetDefault?: () => void
  className?: string
}

function AddressCard({
  address,
  isDefault = false,
  onEdit,
  onDelete,
  onSetDefault,
  className,
}: AddressCardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-xl)] border p-5',
        'bg-[var(--surface-base)] shadow-[var(--elevation-surface)]',
        'hover:shadow-[var(--elevation-card)] transition-all duration-[var(--motion-normal)]',
        isDefault ? 'border-[var(--action-primary)]/40' : 'border-[var(--border-subtle)]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center',
              isDefault
                ? 'bg-[var(--action-primary)]/10 text-[var(--action-primary)]'
                : 'bg-[var(--surface-muted)] text-[var(--text-secondary)]',
            )}
          >
            <MapPin className="w-4 h-4" />
          </div>
          {isDefault && (
            <Badge variant="default" size="sm" className="gap-1">
              <Star className="w-2.5 h-2.5" />
              Default
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              aria-label="Edit address"
              className="h-8 w-8 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              aria-label="Delete address"
              className="h-8 w-8 text-[var(--text-tertiary)] hover:text-[var(--intent-destructive)]"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      <address className="not-italic text-sm text-[var(--text-secondary)] space-y-0.5">
        <p className="font-semibold text-[var(--text-primary)]">{address.fullName}</p>
        <p>{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>
          {address.city}, {address.postalCode}
        </p>
        <p>{address.country}</p>
        <p className="pt-1 text-[var(--text-tertiary)]">{address.phone}</p>
      </address>

      {!isDefault && onSetDefault && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onSetDefault}
          className="mt-4 h-8 text-[length:var(--text-xs)] text-[var(--action-primary)] hover:bg-[var(--action-primary)]/10 gap-1.5"
        >
          <Star className="w-3 h-3" />
          Set as Default
        </Button>
      )}
    </div>
  )
}

export { AddressCard }
