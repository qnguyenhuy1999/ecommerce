'use client'

import { startTransition, useDeferredValue } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@ecom/core-ui'
import type { PaginationMeta } from '@ecom/shared/pagination/core'
import { useControllableState } from '../../hooks/useControllableState'
import { SellerListPage } from '../../organisms/SellerListPage'
import { warehousesColumns } from './Warehouses.utils'
import { defaultProps } from './Warehouses.fixtures'
import type { WarehouseRow, WarehousesProps } from './Warehouses.types'

interface WarehousesClientProps extends WarehousesProps {
  warehouses?: WarehouseRow[]
  loading?: boolean
  meta?: PaginationMeta
  onPageChange?: (page: number) => void
}

export function WarehousesClient({
  warehouses = [],
  loading = false,
  meta,
  onPageChange,
  initialSearch = defaultProps.initialSearch,
  onCreateClick,
}: WarehousesClientProps) {
  const [search, setSearch] = useControllableState({ defaultValue: initialSearch })
  const deferredSearch = useDeferredValue(search)

  const filtered = deferredSearch
    ? warehouses.filter(
        (w) =>
          w.name.toLowerCase().includes(deferredSearch.toLowerCase()) ||
          w.code.toLowerCase().includes(deferredSearch.toLowerCase()),
      )
    : warehouses

  return (
    <SellerListPage
      title="Warehouses"
      description="Manage your warehouses and inventory locations"
      actions={
        <SellerListPage.Actions>
          <Button size="sm" onClick={onCreateClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Warehouse
          </Button>
        </SellerListPage.Actions>
      }
    >
      <SellerListPage.Filters>
        <SellerListPage.Search
          value={search}
          onChange={(v) => {
            startTransition(() => setSearch(v))
          }}
          placeholder="Search warehouses..."
        />
      </SellerListPage.Filters>
      <SellerListPage.Table
        columns={warehousesColumns}
        data={filtered}
        loading={loading}
        meta={meta}
        onPageChange={onPageChange}
        emptyMessage="No warehouses yet."
      />
    </SellerListPage>
  )
}
