'use client'

import { getWebAuthPreset } from '@ecom/auth'
import { createAuthClient } from '@ecom/auth/client'

const { client } = getWebAuthPreset('admin')

export const { AuthProvider, useAuth } = createAuthClient(client)
