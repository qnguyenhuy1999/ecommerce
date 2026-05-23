import { useCallback, useEffect, useRef } from 'react'
import { useForm, useWatch, zodResolver } from '@ecom/core-ui'
import { slugify } from '@ecom/shared/utils'
import type { ShopProfileFormData, ShopProfileProps } from './ShopProfile.types'
import { shopProfileSchema } from './ShopProfile.schema'

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
  const form = useForm<ShopProfileFormData>({
    resolver: zodResolver(shopProfileSchema),
    defaultValues: initialData,
  })
  const values = useWatch({
    control: form.control,
    defaultValue: initialData,
  }) as ShopProfileFormData
  const shopName = useWatch({
    control: form.control,
    name: 'shopName',
    defaultValue: initialData.shopName,
  })
  const slug = useWatch({ control: form.control, name: 'slug', defaultValue: initialData.slug })
  const previousShopNameRef = useRef(initialData.shopName)

  useEffect(() => {
    form.reset(initialData)
    previousShopNameRef.current = initialData.shopName
  }, [form, initialData])

  useEffect(() => {
    if (shopName === previousShopNameRef.current) {
      return
    }

    if (slug === slugify(previousShopNameRef.current)) {
      form.setValue('slug', slugify(shopName), {
        shouldDirty: true,
        shouldValidate: true,
      })
    }

    previousShopNameRef.current = shopName
  }, [form, shopName, slug])

  const handleSubmit = useCallback(
    form.handleSubmit(async (data) => {
      await Promise.resolve(onSubmit?.(data))
    }),
    [form, onSubmit],
  )

  return {
    state: { form: values },
    handlers: {
      form,
      handleSubmit,
      onReplaceLogo,
      onReplaceBanner,
    },
  }
}
