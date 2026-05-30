import { getWebAuthPreset } from '@ecom/auth/web-presets'
import { createWithAuth } from '@ecom/auth/middleware'

const { middleware } = getWebAuthPreset('seller')

export const withAuth = createWithAuth(middleware)
