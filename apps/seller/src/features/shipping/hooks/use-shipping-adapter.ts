'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getShippingBundle, toggleShippingMethod } from '../api'
import { mapShippingProviders } from '../mappers'
import { shippingKeys } from '../query-keys'

export function useShippingAdapter(initialData?: ReturnType<typeof mapShippingProviders>) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: shippingKeys.bundle(),
    queryFn: async () => {
      const bundle = await getShippingBundle()
      return mapShippingProviders(bundle.providers, bundle.methods)
    },
    initialData,
  })

  const toggleMutation = useMutation({
    mutationFn: ({ providerId, enabled }: { providerId: string; enabled: boolean }) =>
      toggleShippingMethod(providerId, enabled),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: shippingKeys.all }),
  })

  return {
    loading: query.isPending,
    error: query.error,
    rows: query.data ?? [],
    onToggle: (providerId: string, enabled: boolean) =>
      toggleMutation.mutateAsync({ providerId, enabled }),
  }
}
