import { z } from '@ecom/core-ui'

export const shopProfileSchema = z.object({
  shopName: z.string().trim().min(1, 'Shop name is required'),
  slug: z.string().trim().min(1, 'Slug is required'),
  tagline: z.string(),
  about: z.string(),
  logoUrl: z.url('Enter valid logo URL'),
  bannerUrl: z.url('Enter valid banner URL'),
  supportEmail: z.email('Enter valid support email'),
  supportPhone: z.string().trim().min(1, 'Support phone is required'),
  country: z.string().trim().min(1, 'Country is required'),
  responseTarget: z.string().trim().min(1, 'Response target is required'),
  followersLabel: z.string(),
  ratingLabel: z.string(),
  previewUrl: z.string().trim().min(1, 'Preview URL is required'),
})
