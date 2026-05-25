import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CategoryHierarchyCategory } from '../../pages/CategoryHierarchy/CategoryHierarchy.types'
import { CategoryTreeRow } from './CategoryTreeRow'

const electronics: CategoryHierarchyCategory = {
  id: 'cat-1',
  name: 'Electronics',
  slug: 'electronics',
  parentId: null,
  sortOrder: 1,
  icon: '🔌',
  featured: true,
  metaTitle: 'Electronics',
  metaDescription: 'Shop electronics',
  canonicalUrl: '/electronics',
  stats: { products: '240', liveVendors: '32', gmv30d: '$18,400' },
  children: [
    {
      id: 'cat-2',
      name: 'Smartphones',
      slug: 'smartphones',
      parentId: 'cat-1',
      sortOrder: 1,
      icon: '📱',
      featured: false,
      metaTitle: 'Smartphones',
      metaDescription: 'Shop smartphones',
      canonicalUrl: '/electronics/smartphones',
      stats: { products: '120', liveVendors: '18', gmv30d: '$10,200' },
      children: [],
    },
    {
      id: 'cat-3',
      name: 'Laptops',
      slug: 'laptops',
      parentId: 'cat-1',
      sortOrder: 2,
      icon: '💻',
      featured: false,
      metaTitle: 'Laptops',
      metaDescription: 'Shop laptops',
      canonicalUrl: '/electronics/laptops',
      stats: { products: '80', liveVendors: '12', gmv30d: '$6,800' },
      children: [],
    },
  ],
}

const meta = {
  title: 'Molecules/CategoryTreeRow',
  component: CategoryTreeRow,
  parameters: {
    layout: 'padded',
  },
  args: {
    category: electronics,
    depth: 0,
    selectedId: null,
    expandedIds: new Set<string>(),
    focusedId: null,
    forceExpanded: false,
    onSelect: () => {},
    onToggle: () => {},
    onFocus: () => {},
    onItemKeyDown: () => {},
  },
} satisfies Meta<typeof CategoryTreeRow>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div role="tree" className="w-80 rounded-xl border p-2">
      <CategoryTreeRow
        category={electronics}
        depth={0}
        selectedId={null}
        expandedIds={new Set(['cat-1'])}
        focusedId={null}
        forceExpanded={false}
        onSelect={() => {}}
        onToggle={() => {}}
        onFocus={() => {}}
        onItemKeyDown={() => {}}
      />
    </div>
  ),
}

export const Selected: Story = {
  render: () => (
    <div role="tree" className="w-80 rounded-xl border p-2">
      <CategoryTreeRow
        category={electronics}
        depth={0}
        selectedId="cat-1"
        expandedIds={new Set(['cat-1'])}
        focusedId="cat-1"
        forceExpanded={false}
        onSelect={() => {}}
        onToggle={() => {}}
        onFocus={() => {}}
        onItemKeyDown={() => {}}
      />
    </div>
  ),
}

export const Collapsed: Story = {
  render: () => (
    <div role="tree" className="w-80 rounded-xl border p-2">
      <CategoryTreeRow
        category={electronics}
        depth={0}
        selectedId={null}
        expandedIds={new Set()}
        focusedId={null}
        forceExpanded={false}
        onSelect={() => {}}
        onToggle={() => {}}
        onFocus={() => {}}
        onItemKeyDown={() => {}}
      />
    </div>
  ),
}

export const ForceExpanded: Story = {
  render: () => (
    <div role="tree" className="w-80 rounded-xl border p-2">
      <CategoryTreeRow
        category={electronics}
        depth={0}
        selectedId={null}
        expandedIds={new Set()}
        focusedId={null}
        forceExpanded={true}
        onSelect={() => {}}
        onToggle={() => {}}
        onFocus={() => {}}
        onItemKeyDown={() => {}}
      />
    </div>
  ),
}
