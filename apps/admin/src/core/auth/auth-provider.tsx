'use client'

import { getWebAuthPreset } from '@ecom/auth/web-presets'
import { createAuthClient, type AuthContextValue } from '@ecom/auth/client'

const { client } = getWebAuthPreset('admin')
const authClient = createAuthClient(client)

export const AuthProvider = authClient.AuthProvider
export const useAuth: () => AuthContextValue = authClient.useAuth
