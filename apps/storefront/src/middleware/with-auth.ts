import { getWebAuthPreset } from '@ecom/auth'
import { createWithAuth } from '@ecom/auth/middleware'

const { middleware } = getWebAuthPreset('storefront')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withAuth: any = createWithAuth(middleware)
