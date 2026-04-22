import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'

import { Button } from '@ecom/ui'

import {
  DataTable,
  DataTableToolbar,
  DataTableBulkActions,
  DataTableColumn,
  DataTableBody,
  DataTableRow,
  DataTableCell,
  DataTableFilter,
  DataTableEmpty,
  DataTablePagination,
  DataTableStatusBadge as StatusBadge,
  DataTableHeader,
} from './DataTable'

const meta: Meta<typeof DataTable> = {
  title: 'molecules/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof DataTable>

/* --- Shared Types --------------------------------------------------------- */
interface ProductRow {
  id: number
  name: string
  sku: string
  price: number
  stock: number
  status: 'active' | 'low_stock' | 'out_of_stock' | 'draft'
  category: string
}

const SAMPLE_PRODUCTS: ProductRow[] = [
  {
    id: 1,
    name: 'Wireless Headphones Pro',
    sku: 'WHP-001',
    price: 89.99,
    stock: 142,
    status: 'active',
    category: 'Audio',
  },
  {
    id: 2,
    name: 'Mechanical Keyboard RGB',
    sku: 'MKR-002',
    price: 129.99,
    stock: 58,
    status: 'low_stock',
    category: 'Peripherals',
  },
  {
    id: 3,
    name: 'USB-C Hub 7-Port',
    sku: 'UCH-003',
    price: 49.99,
    stock: 0,
    status: 'out_of_stock',
    category: 'Accessories',
  },
  {
    id: 4,
    name: 'Monitor Stand Adjustable',
    sku: 'MST-004',
    price: 34.99,
    stock: 210,
    status: 'active',
    category: 'Accessories',
  },
  {
    id: 5,
    name: 'Webcam 4K Ultra HD',
    sku: 'WCM-005',
    price: 149.99,
    stock: 23,
    status: 'low_stock',
    category: 'Video',
  },
  {
    id: 6,
    name: 'Laptop Stand Aluminum',
    sku: 'LST-006',
    price: 59.99,
    stock: 95,
    status: 'active',
    category: 'Accessories',
  },
  {
    id: 7,
    name: 'Wireless Mouse Ergonomic',
    sku: 'WME-007',
    price: 44.99,
    stock: 0,
    status: 'out_of_stock',
    category: 'Peripherals',
  },
  { id: 8, name: 'Portable SSD 1TB', sku: 'PSD-008', price: 89.99, stock: 67, status: 'active', category: 'Storage' },
  {
    id: 9,
    name: 'Desk Lamp LED',
    sku: 'DLL-009',
    price: 29.99,
    stock: 0,
    status: 'out_of_stock',
    category: 'Lighting',
  },
  { id: 10, name: 'Smart Speaker Voice', sku: 'SSV-010', price: 79.99, stock: 189, status: 'draft', category: 'Audio' },
]

/* --- Default ------------------------------------------------------------- */
export const Default: Story = {
  render: () => (
    <div className="not-prose">
      <DataTable card title="Products" description="Manage your product catalog" totalRows={SAMPLE_PRODUCTS.length}>
        <DataTableToolbar
          right={
            <>
              <Button variant="outline" size="sm">
                Export CSV
              </Button>
              <Button variant="default" size="sm">
                Add Product
              </Button>
            </>
          }
        />

        <DataTableHeader>
          <DataTableRow>
            <DataTableColumn>Product</DataTableColumn>
            <DataTableColumn>SKU</DataTableColumn>
            <DataTableColumn>Category</DataTableColumn>
            <DataTableColumn align="right">Price</DataTableColumn>
            <DataTableColumn align="right">Stock</DataTableColumn>
            <DataTableColumn>Status</DataTableColumn>
          </DataTableRow>
        </DataTableHeader>

        <DataTableBody>
          {SAMPLE_PRODUCTS.map((product) => (
            <DataTableRow key={product.id} rowKey={product.id}>
              <DataTableCell className="font-semibold">{product.name}</DataTableCell>
              <DataTableCell muted noWrap>
                <code className="text-[var(--text-xs)]">{product.sku}</code>
              </DataTableCell>
              <DataTableCell muted>{product.category}</DataTableCell>
              <DataTableCell align="right" className="font-medium tabular-nums">
                ${product.price.toFixed(2)}
              </DataTableCell>
              <DataTableCell align="right" muted>
                {product.stock}
              </DataTableCell>
              <DataTableCell>
                <StatusBadge status={product.status} />
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTableBody>
      </DataTable>
    </div>
  ),
}

/* --- With Sorting & Search ------------------------------------------------- */
export const WithSortingAndSearch: Story = {
  render: () => {
    function SortingTable() {
      const [search, setSearch] = useState('')
      const [sortCol, setSortCol] = useState<string | null>(null)
      const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

      const handleSort = (col: string) => {
        if (sortCol === col) {
          setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
        } else {
          setSortCol(col)
          setSortDir('asc')
        }
      }

      const getSortDir = (col: string) => (sortCol === col ? sortDir : null)

      const filtered = SAMPLE_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()),
      )

      const sorted = [...filtered].sort((a, b) => {
        if (!sortCol) return 0
        const aVal = a[sortCol] as string | number
        const bVal = b[sortCol] as string | number
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDir === 'asc' ? aVal - bVal : bVal - aVal
        }
        return 0
      })

      return (
        <div className="not-prose">
          <DataTable card zebraStriping title="Products" description="Search, sort, and manage your catalog">
            <DataTableToolbar
              left={<DataTableFilter value={search} onChange={setSearch} placeholder="Search products..." />}
              right={
                <>
                  <Button variant="outline" size="sm">
                    Export CSV
                  </Button>
                  <Button variant="default" size="sm">
                    Add Product
                  </Button>
                </>
              }
            />

            <DataTableHeader>
              <DataTableRow>
                <DataTableColumn sortable sortDirection={getSortDir('name')} onSort={() => handleSort('name')}>
                  Product
                </DataTableColumn>
                <DataTableColumn>SKU</DataTableColumn>
                <DataTableColumn>Category</DataTableColumn>
                <DataTableColumn
                  sortable
                  sortDirection={getSortDir('price')}
                  onSort={() => handleSort('price')}
                  align="right">
                  Price
                </DataTableColumn>
                <DataTableColumn
                  sortable
                  sortDirection={getSortDir('stock')}
                  onSort={() => handleSort('stock')}
                  align="right">
                  Stock
                </DataTableColumn>
                <DataTableColumn>Status</DataTableColumn>
              </DataTableRow>
            </DataTableHeader>

            <DataTableBody>
              {sorted.length === 0 ? (
                <DataTableEmpty
                  colSpan={6}
                  title="No results found"
                  description="Try adjusting your search terms"
                  action={
                    <Button variant="outline" size="sm" onClick={() => setSearch('')}>
                      Clear Search
                    </Button>
                  }
                />
              ) : (
                sorted.map((product) => (
                  <DataTableRow key={product.id} rowKey={product.id}>
                    <DataTableCell className="font-semibold">{product.name}</DataTableCell>
                    <DataTableCell muted>
                      <code className="text-[var(--text-xs)]">{product.sku}</code>
                    </DataTableCell>
                    <DataTableCell muted>{product.category}</DataTableCell>
                    <DataTableCell align="right" className="font-medium tabular-nums">
                      ${product.price.toFixed(2)}
                    </DataTableCell>
                    <DataTableCell align="right" muted>
                      {product.stock}
                    </DataTableCell>
                    <DataTableCell>
                      <StatusBadge status={product.status} />
                    </DataTableCell>
                  </DataTableRow>
                ))
              )}
            </DataTableBody>

            <DataTablePagination
              page={1}
              pageSize={10}
              totalRows={filtered.length}
              onPageChange={() => {}}
              onPageSizeChange={() => {}}
              showPageSizeSelect
            />
          </DataTable>
        </div>
      )
    }
    return <SortingTable />
  },
}

/* --- Selectable ---------------------------------------------------------- */
export const Selectable: Story = {
  render: () => {
    function SelectableTable() {
      const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([])
      const [page, setPage] = useState(1)
      const pageSize = 10

      const paginated = SAMPLE_PRODUCTS.slice((page - 1) * pageSize, page * pageSize)

      return (
        <div className="not-prose">
          <DataTable
            card
            selectable
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            allRowKeys={paginated.map((p) => p.id)}
            zebraStriping>
            <DataTableToolbar
              heading="Products"
              right={
                <>
                  <Button variant="outline" size="sm">
                    Export CSV
                  </Button>
                  <Button variant="default" size="sm">
                    Add Product
                  </Button>
                </>
              }
            />

            <DataTableBulkActions>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
              <Button variant="outline" size="sm">
                Update Status
              </Button>
              <Button variant="outline" size="sm">
                Duplicate
              </Button>
            </DataTableBulkActions>

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
              {paginated.map((product) => (
                <DataTableRow key={product.id} rowKey={product.id}>
                  <DataTableCell className="font-semibold">{product.name}</DataTableCell>
                  <DataTableCell muted>
                    <code className="text-[var(--text-xs)]">{product.sku}</code>
                  </DataTableCell>
                  <DataTableCell align="right" className="font-medium tabular-nums">
                    ${product.price.toFixed(2)}
                  </DataTableCell>
                  <DataTableCell align="right" muted>
                    {product.stock}
                  </DataTableCell>
                  <DataTableCell>
                    <StatusBadge status={product.status} />
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>

            <DataTablePagination
              page={page}
              pageSize={pageSize}
              totalRows={SAMPLE_PRODUCTS.length}
              onPageChange={setPage}
            />
          </DataTable>
        </div>
      )
    }
    return <SelectableTable />
  },
}

/* --- Loading State -------------------------------------------------------- */
export const LoadingState: Story = {
  render: () => (
    <div className="not-prose">
      <DataTable card loading title="Products">
        <DataTableToolbar right={<DataTableFilter value="" onChange={() => {}} placeholder="Search..." />} />

        <DataTableHeader>
          <DataTableRow>
            <DataTableColumn>Product</DataTableColumn>
            <DataTableColumn>SKU</DataTableColumn>
            <DataTableColumn align="right">Price</DataTableColumn>
            <DataTableColumn align="right">Stock</DataTableColumn>
            <DataTableColumn>Status</DataTableColumn>
          </DataTableRow>
        </DataTableHeader>

        <DataTableBody skeletonRowCount={6} skeletonColumnCount={5} />
      </DataTable>
    </div>
  ),
}

/* --- Empty State ---------------------------------------------------------- */
export const EmptyState: Story = {
  render: () => (
    <div className="not-prose">
      <DataTable card title="Products">
        <DataTableToolbar
          right={
            <Button variant="default" size="sm">
              Add Product
            </Button>
          }
        />

        <DataTableHeader>
          <DataTableRow>
            <DataTableColumn>Product</DataTableColumn>
            <DataTableColumn align="right">Price</DataTableColumn>
            <DataTableColumn align="right">Stock</DataTableColumn>
          </DataTableRow>
        </DataTableHeader>

        <DataTableBody>
          <DataTableEmpty
            colSpan={3}
            title="No products yet"
            description="Add your first product to get started"
            action={
              <Button variant="default" size="sm">
                Add Product
              </Button>
            }
          />
        </DataTableBody>
      </DataTable>
    </div>
  ),
}

/* --- No Results (Filtered) ------------------------------------------------ */
export const NoResults: Story = {
  render: () => {
    function NoResultsTable() {
      const [search, setSearch] = useState('nonexistent product xyz')

      return (
        <div className="not-prose">
          <DataTable card zebraStriping>
            <DataTableToolbar
              right={<DataTableFilter value={search} onChange={setSearch} placeholder="Search products..." />}
            />

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
              <DataTableEmpty
                colSpan={5}
                title="No results found"
                description={`No products match "${search}"`}
                action={
                  <Button variant="outline" size="sm" onClick={() => setSearch('')}>
                    Clear Search
                  </Button>
                }
              />
            </DataTableBody>
          </DataTable>
        </div>
      )
    }
    return <NoResultsTable />
  },
}
