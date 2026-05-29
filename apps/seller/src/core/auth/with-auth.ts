import { getWebAuthPreset } from '@ecom/auth'
import { createWithAuth } from '@ecom/auth/middleware'

const { middleware } = getWebAuthPreset('seller')

export const withAuth = createWithAuth(middleware)
