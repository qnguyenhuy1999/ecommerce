'use client'

import { Button } from '@ecom/core-ui/atoms/Button'
import { Checkbox } from '@ecom/core-ui/atoms/Checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ecom/core-ui/atoms/Form'
import { Input } from '@ecom/core-ui/atoms/Input'
import { useForm } from '@ecom/core-ui/vendors/react-hook-form'
import { zodResolver } from '@ecom/core-ui/vendors/zod-resolver'
import { SectionCard } from '../../atoms/SectionCard'
import { PageHeader } from '../../atoms/PageHeader'
import { warehouseDetailSchema, type WarehouseDetailSchemaData } from './WarehouseDetail.schema'
import { defaultProps } from './WarehouseDetail.fixtures'
import type { WarehouseDetailProps } from './WarehouseDetail.types'

export function WarehouseDetailClient({
  initialValues = defaultProps.initialValues,
  onSubmit = defaultProps.onSubmit,
  onCancel,
  isLoading = defaultProps.isLoading,
}: WarehouseDetailProps) {
  const form = useForm<WarehouseDetailSchemaData>({
    resolver: zodResolver(warehouseDetailSchema),
    defaultValues: { name: '', code: '', address: '', isDefault: false, ...initialValues },
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Add Warehouse" description="Create a new warehouse location" />
      <Form {...form}>
        <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)} className="max-w-2xl space-y-6">
          <SectionCard title="Warehouse Details">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Main Warehouse" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="WH-MAIN"
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <textarea
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      rows={3}
                      placeholder="Full warehouse address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="!mt-0">Set as default warehouse</FormLabel>
                </FormItem>
              )}
            />
          </SectionCard>
          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Warehouse'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
