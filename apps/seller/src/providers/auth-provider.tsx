'use client'

import { getWebAuthPreset } from '@ecom/auth'
import { createAuthClient, type AuthUser } from '@ecom/auth/client'

export type { AuthUser }

const { client } = getWebAuthPreset('seller')

export const { AuthProvider, useAuth } = createAuthClient(client)
