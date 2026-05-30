import { Checkbox } from '@ecom/core-ui/atoms/Checkbox'
import { Typography } from '@ecom/core-ui/atoms/Typography'
import { StatusBadge, type DataTableColumn } from '@ecom/core-ui/organisms/DataTable'
import { ReasonTags } from './ProductApproval.components'
import type { ProductApprovalItem } from './ProductApproval.types'

export function buildProductApprovalColumns(): DataTableColumn<ProductApprovalItem>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
                ? 'indeterminate'
                : false
          }
          onCheckedChange={(checked) => table.toggleAllPageRowsSelected(Boolean(checked))}
          aria-label="Select all visible listings"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
          aria-label={`Select ${row.original.title}`}
        />
      ),
    },
    {
      id: 'listing',
      header: 'Listing',
      cell: ({ row }) => {
        const item = row.original

        return (
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={item.images[0]?.src}
              alt={item.images[0]?.alt ?? item.title}
              className="bg-muted size-10 rounded-xl object-cover"
            />
            <div className="min-w-0">
              <Typography as="div" variant="label" className="truncate">
                {item.title}
              </Typography>
              <Typography variant="body-sm" className="text-muted-foreground">
                {item.sellerName}
              </Typography>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'priceLabel',
      header: 'Price',
      cell: ({ row }) => (
        <Typography as="span" variant="label" className="text-primary">
          {row.original.priceLabel}
        </Typography>
      ),
    },
    {
      accessorKey: 'flagsLabel',
      header: 'Flags',
      cell: ({ row }) => (
        <Typography variant="body-sm" className="text-muted-foreground">
          {row.original.flagsLabel}
        </Typography>
      ),
    },
    {
      id: 'reasonTags',
      header: 'Reason / Tags',
      cell: ({ row }) => (
        <div className="flex flex-wrap items-center gap-2">
          <ReasonTags item={row.original} />
        </div>
      ),
    },
    {
      accessorKey: 'submittedAtLabel',
      header: 'Submitted',
      cell: ({ row }) => (
        <Typography variant="body-sm" className="text-muted-foreground">
          {row.original.submittedAtLabel}
        </Typography>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ]
}
