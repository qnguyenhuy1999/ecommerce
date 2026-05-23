'use client'

import { Button, ConsolePageLayout } from '@ecom/core-ui'
import { Eye, FileText, Send } from 'lucide-react'
import { SectionCard } from '../../atoms/SectionCard'
import { ProductMediaUpload } from '../../molecules/ProductMediaUpload'
import { BasicInfoSection } from './BasicInfoSection'
import {
  PRODUCT_DETAIL_ACTION_LABELS,
  PRODUCT_DETAIL_MEDIA_MAX_ITEMS,
  PRODUCT_DETAIL_MEDIA_SUBTITLE,
  PRODUCT_DETAIL_MEDIA_TITLE,
} from './ProductDetail.constants'
import { ProductEditorProvider, useProductEditorMedia } from './ProductDetail.context'
import type { ProductDetailProps } from './ProductDetail.types'
import { ProductSidebar } from './ProductSidebar'
import { SeoSection } from './SeoSection'
import { ShippingSection } from './ShippingSection'
import { VariantsSection } from './VariantsSection'
import type { ProductEditorProps } from './ProductEditor.types'

type ProductDetailClientProps = Required<ProductDetailProps>

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
}: Pick<
  ProductEditorProps,
  'title' | 'breadcrumb' | 'previewHref' | 'saveDraftHref' | 'publishHref'
>) {
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
            <a href={saveDraftHref}>
              <FileText />
              {PRODUCT_DETAIL_ACTION_LABELS.saveDraft}
            </a>
          </Button>
          <Button asChild size="sm">
            <a href={publishHref}>
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
}: ProductDetailClientProps) {
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
      />
    </ProductEditorProvider>
  )
}
