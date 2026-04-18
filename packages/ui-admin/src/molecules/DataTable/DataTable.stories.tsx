import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'

import { Button } from '@ecom/ui'

import {
  DataTable,
  DataTableHeader,
  DataTableBody,
  DataTableRow,
  DataTableCell,
  DataTableColumn,
  DataTableToolbar,
  DataTableBulkActions,
  DataTableFilter,
  DataTableEmpty,
} from './DataTable'

const meta: Meta<typeof DataTable> = {
  title: 'molecules/DataTable',
  component: DataTable,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DataTable>

interface ProductRow {
  id: number
  name: string
  sku: string
  price: number
  stock: number
  status: 'active' | 'low_stock' | 'out_of_stock'
}

const SAMPLE_PRODUCTS: ProductRow[] = [
  { id: 1, name: 'Wireless Headphones Pro', sku: 'WHP-001', price: 89.99, stock: 142, status: 'active' },
  { id: 2, name: 'Mechanical Keyboard RGB', sku: 'MKR-002', price: 129.99, stock: 58, status: 'low_stock' },
  { id: 3, name: 'USB-C Hub 7-Port', sku: 'UCH-003', price: 49.99, stock: 0, status: 'out_of_stock' },
  { id: 4, name: 'Monitor Stand Adjustable', sku: 'MST-004', price: 34.99, stock: 210, status: 'active' },
  { id: 5, name: 'Webcam 4K Ultra HD', sku: 'WCM-005', price: 149.99, stock: 23, status: 'low_stock' },
  { id: 6, name: 'Laptop Stand Aluminum', sku: 'LST-006', price: 59.99, stock: 95, status: 'active' },
]

const StatusBadge: React.FC<{ status: ProductRow['status'] }> = ({ status }) => {
  const map = {
    active: { label: 'Active', class: 'bg-success/10 text-success' },
    low_stock: { label: 'Low Stock', class: 'bg-warning/10 text-warning' },
    out_of_stock: { label: 'Out of Stock', class: 'bg-destructive/10 text-destructive' },
  }
  const { label, class: className } = map[status]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}

export const Default: Story = {
  render: () => (
    <DataTable>
      <DataTableHeader>
        <DataTableRow>
          <DataTableColumn>Product</DataTableColumn>
          <DataTableColumn>SKU</DataTableColumn>
          <DataTableColumn align="right">Price</DataTableColumn>
          <DataTableColumn align="right">Stock</DataTableColumn>
          <DataTableColumn>Status</DataTableColumn>
        </DataTableRow>
      </DataTableHeader>
      <DataTableBody>
        {SAMPLE_PRODUCTS.map((product) => (
          <DataTableRow key={product.id}>
            <DataTableCell className="font-medium">{product.name}</DataTableCell>
            <DataTableCell className="font-mono text-xs text-muted-foreground">{product.sku}</DataTableCell>
            <DataTableCell align="right">${product.price.toFixed(2)}</DataTableCell>
            <DataTableCell align="right">{product.stock}</DataTableCell>
            <DataTableCell>
              <StatusBadge status={product.status} />
            </DataTableCell>
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  ),
}

function InteractiveTable() {
  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([])
  const [search, setSearch] = useState('')
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>(null)

  const filtered = SAMPLE_PRODUCTS.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()),
  )

  const sorted = [...filtered].sort((a, b) => {
    if (!sortDir) return 0
    return sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  })

  return (
    <DataTable selectable selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} zebraStriping>
      <DataTableToolbar>
        <DataTableFilter value={search} onChange={setSearch} placeholder="Search products..." />
        <Button variant="outline" size="sm">
          Export CSV
        </Button>
        <Button variant="outline" size="sm">
          Add Product
        </Button>
      </DataTableToolbar>

      <DataTableBulkActions>
        <Button variant="outline" size="sm">
          Delete Selected
        </Button>
        <Button variant="outline" size="sm">
          Update Status
        </Button>
      </DataTableBulkActions>

      <DataTableHeader>
        <DataTableRow>
          <DataTableColumn
            sortable
            sortDirection={sortDir}
            onSort={() => setSortDir((prev) => (prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'))}>
            Product
          </DataTableColumn>
          <DataTableColumn>SKU</DataTableColumn>
          <DataTableColumn align="right">Price</DataTableColumn>
          <DataTableColumn align="right">Stock</DataTableColumn>
          <DataTableColumn>Status</DataTableColumn>
        </DataTableRow>
      </DataTableHeader>
      <DataTableBody>
        {sorted.length === 0 ? (
          <DataTableEmpty colSpan={5}>No products found matching your search.</DataTableEmpty>
        ) : (
          sorted.map((product) => (
            <DataTableRow key={product.id} rowKey={product.id}>
              <DataTableCell className="font-medium">{product.name}</DataTableCell>
              <DataTableCell className="font-mono text-xs text-muted-foreground">{product.sku}</DataTableCell>
              <DataTableCell align="right">${product.price.toFixed(2)}</DataTableCell>
              <DataTableCell align="right">{product.stock}</DataTableCell>
              <DataTableCell>
                <StatusBadge status={product.status} />
              </DataTableCell>
            </DataTableRow>
          ))
        )}
      </DataTableBody>
    </DataTable>
  )
}

export const Interactive: Story = {
  render: () => <InteractiveTable />,
}

export const ZebraStriping: Story = {
  render: () => (
    <DataTable zebraStriping>
      <DataTableHeader>
        <DataTableRow>
          <DataTableColumn>Product</DataTableColumn>
          <DataTableColumn align="right">Price</DataTableColumn>
          <DataTableColumn align="right">Stock</DataTableColumn>
        </DataTableRow>
      </DataTableHeader>
      <DataTableBody>
        {SAMPLE_PRODUCTS.slice(0, 4).map((product) => (
          <DataTableRow key={product.id}>
            <DataTableCell className="font-medium">{product.name}</DataTableCell>
            <DataTableCell align="right">${product.price.toFixed(2)}</DataTableCell>
            <DataTableCell align="right">{product.stock}</DataTableCell>
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  ),
}

export const EmptyState: Story = {
  render: () => (
    <DataTable>
      <DataTableHeader>
        <DataTableRow>
          <DataTableColumn>Product</DataTableColumn>
          <DataTableColumn align="right">Price</DataTableColumn>
        </DataTableRow>
      </DataTableHeader>
      <DataTableBody>
        <DataTableEmpty colSpan={2}>No products available. Add your first product to get started.</DataTableEmpty>
      </DataTableBody>
    </DataTable>
  ),
}
