'use client'

import React from 'react'

import { User, Phone, MapPin, Building2 } from 'lucide-react'

import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from '@ecom/ui'

export interface ShippingAddress {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  postalCode: string
  country: string
}

export interface AddressFormProps {
  defaultValues?: Partial<ShippingAddress>
  onSubmit: (address: ShippingAddress) => void
  onCancel?: () => void
  loading?: boolean
  errors?: Partial<Record<keyof ShippingAddress, string>>
  submitLabel?: string
  className?: string
}

const COUNTRIES = [
  { value: 'SG', label: 'Singapore' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'TH', label: 'Thailand' },
  { value: 'PH', label: 'Philippines' },
  { value: 'VN', label: 'Vietnam' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
]

function AddressForm({
  defaultValues = {},
  onSubmit,
  onCancel,
  loading = false,
  errors = {},
  submitLabel = 'Save Address',
  className,
}: AddressFormProps) {
  const [values, setValues] = React.useState<Partial<ShippingAddress>>({
    country: 'SG',
    ...defaultValues,
  })

  function set(field: keyof ShippingAddress, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(values as ShippingAddress)
  }

  const fieldClass = (field: keyof ShippingAddress) =>
    cn(
      'h-10 rounded-[var(--radius-md)] border-[var(--border-default)]',
      'focus:border-[var(--action-primary)] focus:ring-1 focus:ring-[var(--action-primary)]',
      'bg-[var(--surface-base)] transition-all',
      errors[field] && 'border-[var(--intent-destructive)] focus:ring-[var(--intent-destructive)]',
    )

  const errorText = (field: keyof ShippingAddress) =>
    errors[field] ? (
      <p className="text-[length:var(--text-xs)] text-[var(--intent-destructive)] mt-1">
        {errors[field]}
      </p>
    ) : null

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)} noValidate>
      {/* Full Name */}
      <div>
        <Label htmlFor="address-fullName" className="mb-1.5 flex items-center gap-1.5 text-sm">
          <User className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          Full Name
        </Label>
        <Input
          id="address-fullName"
          placeholder="Jane Doe"
          value={values.fullName ?? ''}
          onChange={(e) => set('fullName', e.target.value)}
          className={fieldClass('fullName')}
          required
        />
        {errorText('fullName')}
      </div>

      {/* Phone */}
      <div>
        <Label htmlFor="address-phone" className="mb-1.5 flex items-center gap-1.5 text-sm">
          <Phone className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          Phone
        </Label>
        <Input
          id="address-phone"
          type="tel"
          placeholder="+65 9123 4567"
          value={values.phone ?? ''}
          onChange={(e) => set('phone', e.target.value)}
          className={fieldClass('phone')}
          required
        />
        {errorText('phone')}
      </div>

      {/* Address Line 1 */}
      <div>
        <Label htmlFor="address-line1" className="mb-1.5 flex items-center gap-1.5 text-sm">
          <MapPin className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          Address Line 1
        </Label>
        <Input
          id="address-line1"
          placeholder="123 Orchard Road"
          value={values.addressLine1 ?? ''}
          onChange={(e) => set('addressLine1', e.target.value)}
          className={fieldClass('addressLine1')}
          required
        />
        {errorText('addressLine1')}
      </div>

      {/* Address Line 2 */}
      <div>
        <Label htmlFor="address-line2" className="mb-1.5 flex items-center gap-1.5 text-sm">
          <Building2 className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          Address Line 2<span className="text-[var(--text-tertiary)] font-normal">(optional)</span>
        </Label>
        <Input
          id="address-line2"
          placeholder="Unit #04-01"
          value={values.addressLine2 ?? ''}
          onChange={(e) => set('addressLine2', e.target.value)}
          className={fieldClass('addressLine2')}
        />
      </div>

      {/* City + Postal */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="address-city" className="mb-1.5 text-sm">
            City
          </Label>
          <Input
            id="address-city"
            placeholder="Singapore"
            value={values.city ?? ''}
            onChange={(e) => set('city', e.target.value)}
            className={fieldClass('city')}
            required
          />
          {errorText('city')}
        </div>
        <div>
          <Label htmlFor="address-postal" className="mb-1.5 text-sm">
            Postal Code
          </Label>
          <Input
            id="address-postal"
            placeholder="238858"
            value={values.postalCode ?? ''}
            onChange={(e) => set('postalCode', e.target.value)}
            className={fieldClass('postalCode')}
            required
          />
          {errorText('postalCode')}
        </div>
      </div>

      {/* Country */}
      <div>
        <Label htmlFor="address-country" className="mb-1.5 text-sm">
          Country
        </Label>
        <Select value={values.country ?? 'SG'} onValueChange={(v) => set('country', v)}>
          <SelectTrigger id="address-country" className={cn(fieldClass('country'), 'w-full')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-[var(--radius-lg)] shadow-[var(--elevation-dropdown)]">
            {COUNTRIES.map((c) => (
              <SelectItem key={c.value} value={c.value} className="text-sm cursor-pointer">
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errorText('country')}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 h-10 bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-[var(--action-primary-foreground)] rounded-[var(--radius-md)]"
        >
          {loading ? 'Saving…' : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="sm:w-auto h-10 rounded-[var(--radius-md)]"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

export { AddressForm }
