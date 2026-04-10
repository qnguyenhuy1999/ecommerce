import type { Meta, StoryObj } from '@storybook/react'
import { DataTable } from './index'
import type { ColumnDef } from './types'

const meta = {
  title: 'Molecules/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DataTable>

export default meta
type Story = StoryObj<typeof meta>

interface ProductRow {
  id: number
  name: string
  price: number
  stock: number
  status: string
}

const PRODUCT_COLUMNS: ColumnDef<ProductRow>[] = [
  { key: 'name', header: 'Product', sortable: true },
  { key: 'price', header: 'Price', sortable: true, cell: (row) => `$${row.price}` },
  { key: 'stock', header: 'Stock', sortable: true },
  {
    key: 'status',
    header: 'Status',
    cell: (row) => (
      <span
        style={{
          padding: '2px 8px',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 500,
          backgroundColor: row.status === 'Active' ? '#dcfce7' : '#fee2e2',
          color: row.status === 'Active' ? '#166534' : '#991b1b',
        }}
      >
        {row.status}
      </span>
    ),
  },
]

const SAMPLE_PRODUCTS: ProductRow[] = [
  { id: 1, name: 'Wireless Headphones', price: 89.99, stock: 142, status: 'Active' },
  { id: 2, name: 'Mechanical Keyboard', price: 129.99, stock: 58, status: 'Active' },
  { id: 3, name: 'USB-C Hub', price: 49.99, stock: 0, status: 'Out of Stock' },
  { id: 4, name: 'Monitor Stand', price: 34.99, stock: 210, status: 'Active' },
]

export const Default = {
  args: {
    data: SAMPLE_PRODUCTS,
    columns: PRODUCT_COLUMNS,
    keyField: 'id' as keyof ProductRow,
    totalPages: 3,
    page: 1,
    onPageChange: () => {},
    onSortChange: () => {},
  },
}

export const Selectable = {
  args: {
    data: SAMPLE_PRODUCTS,
    columns: PRODUCT_COLUMNS,
    keyField: 'id' as keyof ProductRow,
    selectable: true,
    selectedKeys: [1, 3] as (string | number)[],
    onSelectionChange: () => {},
    totalPages: 1,
    onPageChange: () => {},
  },
}

export const Loading = {
  args: {
    data: [],
    columns: PRODUCT_COLUMNS,
    keyField: 'id' as keyof ProductRow,
    loading: true,
    pageSize: 5,
    totalPages: 1,
    onPageChange: () => {},
  },
}

export const Empty = {
  args: {
    data: [],
    columns: PRODUCT_COLUMNS,
    keyField: 'id' as keyof ProductRow,
    emptyMessage: 'No products found. Add your first product to get started.',
    totalPages: 1,
    onPageChange: () => {},
  },
}
