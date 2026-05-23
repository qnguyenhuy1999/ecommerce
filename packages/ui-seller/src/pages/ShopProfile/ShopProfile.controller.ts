import { useCallback, useState } from 'react'
import { slugify } from '@ecom/shared/utils'
import type { ShopProfileFormData, ShopProfileProps } from './ShopProfile.types'

type ShopProfileControllerProps = Omit<
  Pick<ShopProfileProps, 'initialData' | 'onSubmit' | 'onReplaceLogo' | 'onReplaceBanner'>,
  'initialData'
> & { initialData: ShopProfileFormData }

export function useShopProfileController({
  initialData,
  onSubmit,
  onReplaceLogo,
  onReplaceBanner,
}: ShopProfileControllerProps) {
  const [form, setForm] = useState<ShopProfileFormData>(initialData)

  const updateForm = useCallback(
    <K extends keyof ShopProfileFormData>(key: K, value: ShopProfileFormData[K]) => {
      setForm((current) => {
        if (key === 'shopName' && current.slug === slugify(current.shopName)) {
          const shopName = typeof value === 'string' ? value : String(value)
          return {
            ...current,
            shopName,
            slug: slugify(shopName),
          }
        }
        return { ...current, [key]: value }
      })
    },
    [],
  )

  const handleSubmit = useCallback(() => {
    onSubmit?.(form)
  }, [form, onSubmit])

  return {
    state: { form },
    handlers: {
      updateForm,
      handleSubmit,
      onReplaceLogo,
      onReplaceBanner,
    },
  }
}
