import { getWebAuthPreset } from '@ecom/auth/web-presets'
import { createWithAuth } from '@ecom/auth/middleware'

const { middleware } = getWebAuthPreset('storefront')

const withAuth = createWithAuth(middleware)

export { withAuth }
