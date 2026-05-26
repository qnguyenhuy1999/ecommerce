import { createApiClient } from '@ecom/config/api-client'

const STOREFRONT_API_PORT = 4000
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? `http://localhost:${STOREFRONT_API_PORT}`

export const api = createApiClient({ baseUrl: API_BASE })
