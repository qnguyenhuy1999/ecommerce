import { z } from '@ecom/core-ui/vendors/zod'

function optionalNonNegativeNumber(fieldLabel: string) {
  return z.string().refine((value) => {
    const trimmed = value.trim()

    if (trimmed === '') {
      return true
    }

    const parsed = Number(trimmed)
    return !Number.isNaN(parsed) && parsed >= 0
  }, `${fieldLabel} must be 0 or more`)
}

export const productDetailSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required'),
  category: z.string().trim().min(1, 'Category is required'),
  brand: z.string(),
  shortDescription: z.string().max(120, 'Short description must be 120 characters or less'),
  fullDescription: z.string(),
  weightKg: optionalNonNegativeNumber('Weight'),
  lengthCm: optionalNonNegativeNumber('Length'),
  widthCm: optionalNonNegativeNumber('Width'),
  heightCm: optionalNonNegativeNumber('Height'),
  slug: z.string().trim().min(1, 'URL slug is required'),
  metaTitle: z.string().max(60, 'Meta title must be 60 characters or less'),
  metaDescription: z.string().max(160, 'Meta description must be 160 characters or less'),
})

export type ProductDetailFormValues = z.infer<typeof productDetailSchema>
