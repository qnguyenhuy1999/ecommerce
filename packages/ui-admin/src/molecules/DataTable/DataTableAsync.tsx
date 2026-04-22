import React, { Suspense } from 'react'

import { DataTableSkeleton } from './DataTableSkeleton'

/**
 * Streaming-ready DataTable variant.
 * Accepts a server-side data fetcher and wraps the result in a Suspense boundary.
 * Enables fast initial paint with skeleton fallback while data loads.
 *
 * @example
 * ```tsx
 * async function getProducts() {
 *   const products = await db.product.findMany()
 *   return products
 * }
 *
 * // In a server component:
 * <DataTableAsync fetcher={getProducts}>
 *   {(data) => (
 *     <DataTable data={data}>
 *       ...columns
 *     </DataTable>
 *   )}
 * </DataTableAsync>
 * ```
 */
export function DataTableAsync<TRow extends object = Record<string, unknown>>({
  fetcher,
  skeletonProps,
  children,
}: {
  /** Async function that returns table data */
  fetcher: () => Promise<TRow[]>
  /** Props passed to the skeleton fallback */
  skeletonProps?: {
    rowCount?: number
    columnCount?: number
  }
  /** Render function receiving the fetched data */
  children: (data: TRow[]) => React.ReactNode
}) {
  return (
    <Suspense fallback={<DataTableSkeleton {...skeletonProps} />}>
      <DataTableAsyncInner fetcher={fetcher} children={children} />
    </Suspense>
  )
}

async function DataTableAsyncInner<TRow extends object = Record<string, unknown>>({
  fetcher,
  children,
}: {
  fetcher: () => Promise<TRow[]>
  children: (data: TRow[]) => React.ReactNode
}) {
  const data = await fetcher()
  return <>{children(data)}</>
}
