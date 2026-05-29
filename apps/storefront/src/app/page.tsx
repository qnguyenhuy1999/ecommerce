import { Home } from '@ecom/ui-storefront'
import { mapHomepageToHomeContent } from '../features/home/mappers/homepage-mapper'
import { api } from '../lib/api'
import type { HomepageResponse } from '../lib/storefront-contracts'

export default async function StorefrontHomePage() {
  const response = await api<HomepageResponse>('/homepage', { cache: 'no-store' })

  return <Home content={mapHomepageToHomeContent(response.data)} />
}
