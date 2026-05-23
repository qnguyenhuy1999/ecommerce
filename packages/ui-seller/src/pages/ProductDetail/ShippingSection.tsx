'use client'

import {
  Checkbox,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  NumberInput,
} from '@ecom/core-ui'
import { SectionCard } from '../../atoms/SectionCard'
import { useProductEditorShipping } from './ProductDetail.context'

function toNumberInputValue(value: string) {
  if (value.trim() === '') {
    return ''
  }

  const parsed = Number(value)
  return Number.isNaN(parsed) ? '' : parsed
}

function toStringValue(value: number | '') {
  return value === '' ? '' : String(value)
}

export function ShippingSection() {
  const { form, shippingMethods, updateDimension, onShippingMethodChange } =
    useProductEditorShipping()

  return (
    <SectionCard title="Shipping">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FormField
            control={form.control}
            name="weightKg"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <NumberInput
                    min={0}
                    step={0.01}
                    value={toNumberInputValue(field.value ?? '')}
                    onChange={(value) => updateDimension('weightKg', toStringValue(value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lengthCm"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Length (cm)</FormLabel>
                <FormControl>
                  <NumberInput
                    min={0}
                    step={0.01}
                    value={toNumberInputValue(field.value ?? '')}
                    onChange={(value) => updateDimension('lengthCm', toStringValue(value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="widthCm"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Width (cm)</FormLabel>
                <FormControl>
                  <NumberInput
                    min={0}
                    step={0.01}
                    value={toNumberInputValue(field.value ?? '')}
                    onChange={(value) => updateDimension('widthCm', toStringValue(value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="heightCm"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Height (cm)</FormLabel>
                <FormControl>
                  <NumberInput
                    min={0}
                    step={0.01}
                    value={toNumberInputValue(field.value ?? '')}
                    onChange={(value) => updateDimension('heightCm', toStringValue(value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          {shippingMethods.map((method) => (
            <label
              key={method.id}
              className="bg-muted/45 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm"
            >
              <Checkbox
                checked={method.checked}
                onCheckedChange={(checked) => onShippingMethodChange(method.id, checked === true)}
                aria-label={method.label}
              />
              <span>{method.label}</span>
            </label>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}
