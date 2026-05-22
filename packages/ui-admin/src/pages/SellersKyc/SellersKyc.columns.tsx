import { Badge, Button, Typography, type DataTableColumn } from '@ecom/core-ui'
import { ArrowRight } from 'lucide-react'
import {
  formatSellerKycGmv,
  sellerKycStatusLabels,
  sellerKycStatusToneClassNames,
} from './SellersKyc.constants'
import type { SellerKycRow } from './SellersKyc.types'

function renderStatusBadge(item: SellerKycRow) {
  const tone = sellerKycStatusToneClassNames[item.status]

  return (
    <Badge
      variant="ghost"
      className={`h-8 rounded-full px-3 text-base font-semibold ${tone.badge}`}
    >
      <span className={`size-2.5 rounded-full ${tone.dot}`} />
      {sellerKycStatusLabels[item.status]}
    </Badge>
  )
}

function buildHeader(label: string, className?: string) {
  return (
    <div
      className={[
        'text-muted-foreground text-xs font-semibold tracking-[0.12em] uppercase',
        className ?? '',
      ].join(' ')}
    >
      {label}
    </div>
  )
}

export function buildSellersKycColumns(
  reviewLabel: string,
  onReview?: (item: SellerKycRow) => void,
): DataTableColumn<SellerKycRow>[] {
  return [
    {
      accessorKey: 'vendorName',
      header: () => buildHeader('Vendor'),
      cell: ({ row }) => (
        <div className="space-y-1 py-1">
          <Typography as="div" variant="label" className="text-base font-semibold">
            {row.original.vendorName}
          </Typography>
          <Typography variant="body-sm" className="text-muted-foreground text-[15px]">
            {row.original.vendorEmail}
          </Typography>
        </div>
      ),
    },
    {
      accessorKey: 'ownerName',
      header: () => buildHeader('Owner'),
      cell: ({ row }) => <span className="text-base font-medium">{row.original.ownerName}</span>,
    },
    {
      accessorKey: 'category',
      header: () => buildHeader('Category'),
      cell: ({ row }) => <span className="text-base">{row.original.category}</span>,
    },
    {
      id: 'products',
      accessorKey: 'productsCount',
      header: () => buildHeader('Products', 'text-right'),
      cell: ({ row }) => <div className="text-right text-base">{row.original.productsCount}</div>,
    },
    {
      id: 'gmv',
      accessorKey: 'gmv',
      header: () => buildHeader('GMV', 'text-right'),
      cell: ({ row }) => (
        <Typography
          as="div"
          variant="label"
          className="text-warning text-right text-base font-semibold"
        >
          {formatSellerKycGmv(row.original.gmv)}
        </Typography>
      ),
    },
    {
      accessorKey: 'appliedAtLabel',
      header: () => buildHeader('Applied'),
      cell: ({ row }) => (
        <Typography as="span" variant="body-sm" className="text-muted-foreground text-[15px]">
          {row.original.appliedAtLabel}
        </Typography>
      ),
    },
    {
      accessorKey: 'status',
      header: () => buildHeader('Status'),
      cell: ({ row }) => renderStatusBadge(row.original),
    },
    {
      id: 'review',
      header: '',
      cell: ({ row }) => (
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-10 rounded-full px-5 text-base font-semibold"
          onClick={() => onReview?.(row.original)}
        >
          {reviewLabel}
          <ArrowRight className="size-4" />
        </Button>
      ),
    },
  ]
}
