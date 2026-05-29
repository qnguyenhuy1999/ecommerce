'use client'

import { getWebAuthPreset } from '@ecom/auth'
import { createAuthClient, type AuthContextValue, type AuthUser } from '@ecom/auth/client'

export type { AuthUser }

const { client } = getWebAuthPreset('seller')
const authClient = createAuthClient(client)

export const AuthProvider = authClient.AuthProvider
export const useAuth: () => AuthContextValue = authClient.useAuth
