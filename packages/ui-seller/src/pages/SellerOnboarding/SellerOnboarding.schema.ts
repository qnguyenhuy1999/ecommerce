import { z } from '@ecom/core-ui'

export const sellerOnboardingSchema = z.object({
  account: z.object({
    email: z.email('Valid email required'),
    mobileNumber: z.string().min(1, 'Required'),
    password: z.string().min(8, 'At least 8 characters with a number'),
    otp: z.string(),
  }),
  shop: z.object({
    shopName: z.string().min(1, 'Required'),
    shopUrl: z.string(),
    category: z.string().min(1, 'Required'),
    country: z.string().min(1, 'Required'),
    pickupAddress: z.string().min(1, 'Required'),
  }),
  kyc: z.object({
    businessType: z.string().min(1, 'Required'),
    idType: z.string().min(1, 'Required'),
    legalName: z.string().min(1, 'Required'),
    idNumber: z.string().min(1, 'Required'),
    bankName: z.string().min(1, 'Required'),
    accountHolder: z.string().min(1, 'Required'),
    accountNumber: z.string().min(1, 'Required'),
    swiftRouting: z.string(),
    documents: z.object({
      idFront: z.string(),
      idBack: z.string(),
      selfieWithId: z.string(),
      businessRegistration: z.string(),
    }),
  }),
})
