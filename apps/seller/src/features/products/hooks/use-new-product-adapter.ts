'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ProductDetailFormData } from '@ecom/ui-seller'
import type { ProductStatus } from '@ecom/contracts'
import { useQuery, useMutation } from '@tanstack/react-query'
import { createProduct, getProductCategories } from '../api'
import type { SellerCategory } from '../mappers'
import { flattenCategories, mapProductFormToCreatePayload } from '../mappers'
import { productKeys } from '../query-keys'

export function useNewProductAdapter() {
  const router = useRouter()

  const categoriesQuery = useQuery({
    queryKey: productKeys.categories(),
    queryFn: () => getProductCategories(),
  })

  const createMutation = useMutation({
    mutationFn: ({ payload, status }: { payload: ReturnType<typeof mapProductFormToCreatePayload>; status: ProductStatus }) =>
      createProduct(payload, status),
    onSuccess: () => router.push('/products'),
  })

  const categories = (categoriesQuery.data ?? []) as SellerCategory[]

  const handlePersist = async (data: ProductDetailFormData, status: ProductStatus) => {
    const payload = mapProductFormToCreatePayload(data, categories, status)
    await createMutation.mutateAsync({ payload, status })
  }

  return {
    loading: categoriesQuery.isPending,
    error: categoriesQuery.error,
    categories: flattenCategories(categories).map((c) => c.name),
    rawCategories: categories,
    onSaveDraft: (data: ProductDetailFormData) => handlePersist(data, 'DRAFT'),
    onPublish: (data: ProductDetailFormData) => handlePersist(data, 'PUBLISHED'),
  }
}
