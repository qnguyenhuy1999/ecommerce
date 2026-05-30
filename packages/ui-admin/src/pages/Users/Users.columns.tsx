import { Avatar, AvatarFallback, AvatarImage } from '@ecom/core-ui/atoms/Avatar'
import { Checkbox } from '@ecom/core-ui/atoms/Checkbox'
import { Typography } from '@ecom/core-ui/atoms/Typography'
import { StatusBadge, type DataTableColumn } from '@ecom/core-ui/organisms/DataTable'
import type { UserAccountRecord } from './Users.types'

export function buildUserColumns(): DataTableColumn<UserAccountRecord>[] {
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
          aria-label="Select all visible users"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
          aria-label={`Select ${row.original.name}`}
        />
      ),
    },
    {
      id: 'user',
      header: 'User',
      cell: ({ row }) => {
        const item = row.original

        return (
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="size-10 rounded-full">
              <AvatarImage src={item.avatarUrl} alt={item.name} />
              <AvatarFallback>{item.avatarFallback}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <Typography as="div" variant="label" className="truncate">
                {item.name}
              </Typography>
              <Typography variant="body-sm" className="text-muted-foreground truncate">
                {item.email}
              </Typography>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => row.original.role.charAt(0) + row.original.role.slice(1).toLowerCase(),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'countryCode',
      header: 'Country',
    },
    {
      accessorKey: 'ordersCount',
      header: () => <div className="text-right">Orders</div>,
      cell: ({ row }) => <div className="text-right">{row.original.ordersCount}</div>,
    },
    {
      accessorKey: 'spendLabel',
      header: () => <div className="text-right">Spend</div>,
      cell: ({ row }) => (
        <Typography variant="body-sm" className="text-warning block text-right font-semibold">
          {row.original.spendLabel}
        </Typography>
      ),
    },
    {
      accessorKey: 'lastSeenLabel',
      header: 'Last seen',
      cell: ({ row }) => (
        <Typography variant="body-sm" className="text-muted-foreground">
          {row.original.lastSeenLabel}
        </Typography>
      ),
    },
  ]
}
