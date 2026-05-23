import { Checkbox, StatusBadge } from '@ecom/core-ui'
import type { DataTableColumn } from '@ecom/core-ui'
import { formatCurrency } from '@ecom/shared/utils'
import type { ProductRow } from './Products.types'

const selectColumn: DataTableColumn<ProductRow> = {
  id: 'select',
  header: ({ table }) => (
    <Checkbox
      checked={table.getIsAllRowsSelected()}
      onCheckedChange={table.getToggleAllRowsSelectedHandler()}
      aria-label="Select all products"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={row.getToggleSelectedHandler()}
      aria-label={`Select ${row.original.name}`}
    />
  ),
}

const productColumn: DataTableColumn<ProductRow> = {
  id: 'product',
  header: 'Product',
  cell: ({ row }) => {
    const product = row.original

    return (
      <div className="flex items-center gap-3">
        <img src={product.image} alt={product.name} className="h-11 w-11 rounded-xl object-cover" />
        <div className="min-w-0">
          <div className="text-foreground truncate text-sm font-medium">{product.name}</div>
          <div className="text-muted-foreground text-sm">
            {product.sku} - {product.category}
          </div>
        </div>
      </div>
    )
  },
}

const statusColumn: DataTableColumn<ProductRow> = {
  accessorKey: 'status',
  header: 'Status',
  cell: ({ row }) => <StatusBadge status={row.original.status} />,
}

const priceColumn: DataTableColumn<ProductRow> = {
  accessorKey: 'price',
  header: 'Price',
  cell: ({ row }) => (
    <span className="text-primary font-medium">
      {formatCurrency(row.original.price, { fractionDigits: 0 })}
    </span>
  ),
}

const stockColumn: DataTableColumn<ProductRow> = {
  accessorKey: 'stock',
  header: 'Stock',
}

const soldColumn: DataTableColumn<ProductRow> = {
  accessorKey: 'sold',
  header: 'Sold',
}

const ratingColumn: DataTableColumn<ProductRow> = {
  accessorKey: 'rating',
  header: 'Rating',
  cell: ({ row }) => row.original.rating.toFixed(1),
}

export const productsColumns: DataTableColumn<ProductRow>[] = [
  selectColumn,
  productColumn,
  statusColumn,
  priceColumn,
  stockColumn,
  soldColumn,
  ratingColumn,
]
