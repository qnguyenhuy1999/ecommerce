import type { Meta, StoryObj } from '@storybook/react'

import {
  ProductCard,
  ProductCardImage,
  ProductCardContent,
  ProductCardTitle,
  ProductCardBadge,
  ProductCardMeta,
  ProductCardRating,
  ProductCardPrice,
} from './index'

const meta: Meta<typeof ProductCard> = {
  title: 'ui-storefront/molecules/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ProductCard>

export const Default: Story = {
  render: () => (
    <div className="w-72">
      <ProductCard id="p1" title="Wireless Noise-Cancelling Headphones">
        <ProductCardImage
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"
          alt="Wireless Headphones"
        />
        <ProductCardContent>
          <ProductCardTitle />
          <ProductCardRating value={4.5} count={2847} />
          <ProductCardPrice price={299.99} />
        </ProductCardContent>
      </ProductCard>
    </div>
  ),
}

export const OnSale: Story = {
  render: () => (
    <div className="w-72">
      <ProductCard id="p2" title="Premium Leather Crossbody Bag">
        <ProductCardImage
          src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop"
          alt="Leather Bag"
        />
        <ProductCardBadge>30% Off</ProductCardBadge>
        <ProductCardContent>
          <ProductCardTitle />
          <ProductCardRating value={4.2} count={412} />
          <ProductCardPrice price={89.99} originalPrice={129.99} />
        </ProductCardContent>
      </ProductCard>
    </div>
  ),
}

export const NewArrival: Story = {
  render: () => (
    <div className="w-72">
      <ProductCard id="p3" title="Smart Fitness Watch Pro">
        <ProductCardImage
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop"
          alt="Smart Watch"
        />
        <ProductCardBadge>New</ProductCardBadge>
        <ProductCardContent>
          <ProductCardTitle />
          <ProductCardRating value={4.8} count={89} />
          <ProductCardPrice price={249.99} />
        </ProductCardContent>
      </ProductCard>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="w-72">
      <ProductCard id="p4" title="Loading..." loading>
        <ProductCardImage
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"
          alt=""
        />
        <ProductCardContent />
      </ProductCard>
    </div>
  ),
}

export const BestSeller: Story = {
  render: () => (
    <div className="w-72">
      <ProductCard id="p5" title="Ergonomic Office Chair">
        <ProductCardImage
          src="https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=300&fit=crop"
          alt="Office Chair"
        />
        <ProductCardBadge>Best Seller</ProductCardBadge>
        <ProductCardContent>
          <ProductCardTitle />
          <ProductCardMeta>
            <span>2,847 sold this month</span>
          </ProductCardMeta>
          <ProductCardRating value={4.6} count={14238} />
          <ProductCardPrice price={349.99} />
        </ProductCardContent>
      </ProductCard>
    </div>
  ),
}

export const LowStock: Story = {
  render: () => (
    <div className="w-72">
      <ProductCard id="p6" title="Limited Edition Sneakers">
        <ProductCardImage
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop"
          alt="Sneakers"
        />
        <ProductCardBadge>Only 3 left</ProductCardBadge>
        <ProductCardContent>
          <ProductCardTitle />
          <ProductCardMeta>
            <span className="text-warning font-medium">Selling fast</span>
          </ProductCardMeta>
          <ProductCardRating value={4.9} count={67} />
          <ProductCardPrice price={199.99} />
        </ProductCardContent>
      </ProductCard>
    </div>
  ),
}

export const WithHref: Story = {
  render: () => (
    <div className="w-72">
      <ProductCard id="p7" title="Running Shoes Elite" href="/product/running-shoes">
        <ProductCardImage
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop"
          alt="Running Shoes"
        />
        <ProductCardContent>
          <ProductCardTitle />
          <ProductCardRating value={4.4} count={3201} />
          <ProductCardPrice price={159.99} originalPrice={199.99} />
        </ProductCardContent>
      </ProductCard>
    </div>
  ),
}
