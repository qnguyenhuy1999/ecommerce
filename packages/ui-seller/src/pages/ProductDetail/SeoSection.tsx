'use client'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ecom/core-ui/atoms/Form'
import { Input } from '@ecom/core-ui/atoms/Input'
import { Textarea } from '@ecom/core-ui/atoms/Textarea'
import { SectionCard } from '../../atoms/SectionCard'
import { useProductEditorSeo } from './ProductDetail.context'

export function SeoSection() {
  const { form, onSlugChange, updateForm } = useProductEditorSeo()

  return (
    <SectionCard title="SEO">
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>URL slug</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    onChange={(event) => onSlugChange(event.target.value)}
                  />
                </FormControl>
                <FormDescription>halomarket.co/p/...</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Meta title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Up to 60 chars"
                    value={field.value ?? ''}
                    onChange={(event) => updateForm('metaTitle', event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="metaDescription"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Meta description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={5}
                  placeholder="Up to 160 chars"
                  value={field.value ?? ''}
                  onChange={(event) => updateForm('metaDescription', event.target.value)}
                />
              </FormControl>
              <FormDescription>Up to 160 chars</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </SectionCard>
  )
}
