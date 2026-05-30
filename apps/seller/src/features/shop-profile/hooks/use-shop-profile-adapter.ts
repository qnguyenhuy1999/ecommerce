'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ShopProfileFormData } from '@ecom/ui-seller'
import { getShopProfile, updateShopProfile } from '../api'
import { mapProfileFormToUpdateShopPayload, mapShopToProfileForm } from '../mappers'
import { shopProfileKeys } from '../query-keys'

export function useShopProfileAdapter(initialData?: ReturnType<typeof mapShopToProfileForm>) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: shopProfileKeys.profile(),
    queryFn: async () => {
      const shop = await getShopProfile()
      return mapShopToProfileForm(shop)
    },
    initialData,
  })

  const updateMutation = useMutation({
    mutationFn: (data: ShopProfileFormData) =>
      updateShopProfile(mapProfileFormToUpdateShopPayload(data)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: shopProfileKeys.all }),
  })

  return {
    loading: query.isPending,
    error: query.error,
    formData: query.data,
    onSubmit: async (data: ShopProfileFormData) => {
      await updateMutation.mutateAsync(data)
    },
  }
}
