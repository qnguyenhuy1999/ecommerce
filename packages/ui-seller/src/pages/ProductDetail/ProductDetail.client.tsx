'use client'

import { Button, ConsolePageLayout } from '@ecom/core-ui'
import { Eye, FileText, Send } from 'lucide-react'
import type { MouseEvent } from 'react'
import { SectionCard } from '../../atoms/SectionCard'
import { ProductMediaUpload } from '../../molecules/ProductMediaUpload'
import { BasicInfoSection } from './BasicInfoSection'
import {
  PRODUCT_DETAIL_ACTION_LABELS,
  PRODUCT_DETAIL_MEDIA_MAX_ITEMS,
  PRODUCT_DETAIL_MEDIA_SUBTITLE,
  PRODUCT_DETAIL_MEDIA_TITLE,
} from './ProductDetail.constants'
import {
  ProductEditorProvider,
  useProductEditorForm,
  useProductEditorMedia,
} from './ProductDetail.context'
import type { ProductDetailFormData, ProductDetailProps } from './ProductDetail.types'
import { ProductSidebar } from './ProductSidebar'
import { SeoSection } from './SeoSection'
import { ShippingSection } from './ShippingSection'
import { VariantsSection } from './VariantsSection'
import type { ProductEditorProps } from './ProductEditor.types'

type ProductDetailClientProps = Required<Omit<ProductDetailProps, 'onSaveDraft' | 'onPublish'>> &
  Pick<ProductDetailProps, 'onSaveDraft' | 'onPublish'>

function ProductMediaSection() {
  const { media, onAdd, onRemove } = useProductEditorMedia()

  return (
    <SectionCard title={PRODUCT_DETAIL_MEDIA_TITLE} subtitle={PRODUCT_DETAIL_MEDIA_SUBTITLE}>
      <ProductMediaUpload
        className="border-0 bg-transparent p-0"
        items={media}
        maxItems={PRODUCT_DETAIL_MEDIA_MAX_ITEMS}
        onAdd={onAdd}
        onRemove={onRemove}
      />
    </SectionCard>
  )
}

function ProductDetailContent({
  title,
  breadcrumb,
  previewHref,
  saveDraftHref,
  publishHref,
  onSaveDraft,
  onPublish,
}: Pick<
  ProductEditorProps,
  'title' | 'breadcrumb' | 'previewHref' | 'saveDraftHref' | 'publishHref'
> &
  Pick<ProductDetailProps, 'onSaveDraft' | 'onPublish'>) {
  const { form } = useProductEditorForm()

  const handleValidatedNavigation = async (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const isValid = await form.trigger(undefined, { shouldFocus: true })

    if (!isValid) {
      event.preventDefault()
      return
    }

    if (href === '#') {
      event.preventDefault()
    }
  }

  const handleValidatedSubmit = async (
    event: MouseEvent<HTMLAnchorElement>,
    callback?: (data: ProductDetailFormData) => void | Promise<void>,
  ) => {
    if (!callback) return

    const isValid = await form.trigger(undefined, { shouldFocus: true })

    if (!isValid) {
      event.preventDefault()
      return
    }

    event.preventDefault()
    await callback(form.getValues() as ProductDetailFormData)
  }

  return (
    <ConsolePageLayout
      title={title}
      breadcrumb={breadcrumb}
      actions={
        <>
          <Button asChild size="sm" variant="outline">
            <a href={previewHref}>
              <Eye />
              {PRODUCT_DETAIL_ACTION_LABELS.preview}
            </a>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a
              href={saveDraftHref}
              onClick={(event) =>
                void (onSaveDraft
                  ? handleValidatedSubmit(event, onSaveDraft)
                  : handleValidatedNavigation(event, saveDraftHref))
              }
            >
              <FileText />
              {PRODUCT_DETAIL_ACTION_LABELS.saveDraft}
            </a>
          </Button>
          <Button asChild size="sm">
            <a
              href={publishHref}
              onClick={(event) =>
                void (onPublish
                  ? handleValidatedSubmit(event, onPublish)
                  : handleValidatedNavigation(event, publishHref))
              }
            >
              <Send />
              {PRODUCT_DETAIL_ACTION_LABELS.publish}
            </a>
          </Button>
        </>
      }
      mainClassName="space-y-5"
      aside={<ProductSidebar />}
    >
      <BasicInfoSection />
      <ProductMediaSection />
      <VariantsSection />
      <ShippingSection />
      <SeoSection />
    </ConsolePageLayout>
  )
}

export function ProductDetailClient({
  title,
  breadcrumb,
  previewHref,
  saveDraftHref,
  publishHref,
  lastSavedLabel,
  categories,
  brands,
  statuses,
  initialData,
  onSaveDraft,
  onPublish,
}: ProductDetailClientProps) {
  const optionalProps = {
    ...(onSaveDraft ? { onSaveDraft } : {}),
    ...(onPublish ? { onPublish } : {}),
  }

  return (
    <ProductEditorProvider
      categories={categories}
      brands={brands}
      statuses={statuses}
      lastSavedLabel={lastSavedLabel}
      initialData={initialData}
    >
      <ProductDetailContent
        title={title}
        breadcrumb={breadcrumb}
        previewHref={previewHref}
        saveDraftHref={saveDraftHref}
        publishHref={publishHref}
        {...optionalProps}
      />
    </ProductEditorProvider>
  )
}
