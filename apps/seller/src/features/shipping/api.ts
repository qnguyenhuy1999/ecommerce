import {
  getShippingBundle as getShippingBundleBase,
  toggleShippingMethod as toggleShippingMethodBase,
} from '../integration/seller-page-api'

export async function getShippingBundle() {
  const bundle = await getShippingBundleBase()
  return {
    providers: bundle.providers.items,
    methods: bundle.methods.items,
  }
}

export async function toggleShippingMethod(providerId: string, enabled: boolean) {
  const method = await toggleShippingMethodBase(providerId, enabled)
  return method.items
}
