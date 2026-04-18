import type { Meta, StoryObj } from '@storybook/react'

import { ProductGallery, ProductGalleryMain, ProductGalleryThumbnails } from './ProductGallery'

const meta: Meta<typeof ProductGallery> = {
  title: 'organisms/ProductGallery',
  component: ProductGallery,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ProductGallery>

const GALLERY_IMAGES = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
    alt: 'Wireless Headphones — Front',
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop&crop=right',
    alt: 'Wireless Headphones — Side',
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop&crop=bottom',
    alt: 'Wireless Headphones — Detail',
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop',
    alt: 'Wireless Headphones — Lifestyle',
  },
]

export const Default: Story = {
  render: () => (
    <div className="max-w-2xl p-4">
      <ProductGallery images={GALLERY_IMAGES}>
        <ProductGalleryMain />
        <ProductGalleryThumbnails direction="vertical" />
      </ProductGallery>
    </div>
  ),
}

export const HorizontalThumbnails: Story = {
  render: () => (
    <div className="max-w-2xl p-4">
      <ProductGallery images={GALLERY_IMAGES}>
        <ProductGalleryMain />
        <ProductGalleryThumbnails direction="horizontal" />
      </ProductGallery>
    </div>
  ),
}

export const SingleImage: Story = {
  render: () => (
    <div className="max-w-2xl p-4">
      <ProductGallery
        images={[
          {
            id: '1',
            src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
            alt: 'Single view',
          },
        ]}>
        <ProductGalleryMain showControls={false} />
      </ProductGallery>
    </div>
  ),
}

export const ManyImages: Story = {
  render: () => (
    <div className="max-w-2xl p-4">
      <ProductGallery
        images={[
          {
            id: '1',
            src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
            alt: 'View 1',
          },
          {
            id: '2',
            src: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop',
            alt: 'View 2',
          },
          {
            id: '3',
            src: 'https://images.unsplash.com/photo-1485968589780-6cc7b7f3bded?w=800&h=800&fit=crop',
            alt: 'View 3',
          },
          {
            id: '4',
            src: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&h=800&fit=crop',
            alt: 'View 4',
          },
          {
            id: '5',
            src: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop',
            alt: 'View 5',
          },
          {
            id: '6',
            src: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop',
            alt: 'View 6',
          },
        ]}>
        <ProductGalleryMain />
        <ProductGalleryThumbnails direction="vertical" />
      </ProductGallery>
    </div>
  ),
}

export const InitialIndex2: Story = {
  render: () => (
    <div className="max-w-2xl p-4">
      <ProductGallery images={GALLERY_IMAGES} initialIndex={2}>
        <ProductGalleryMain />
        <ProductGalleryThumbnails direction="vertical" />
      </ProductGallery>
    </div>
  ),
}

export const NoControls: Story = {
  render: () => (
    <div className="max-w-2xl p-4">
      <ProductGallery images={GALLERY_IMAGES}>
        <ProductGalleryMain showControls={false} />
        <ProductGalleryThumbnails direction="vertical" />
      </ProductGallery>
    </div>
  ),
}
