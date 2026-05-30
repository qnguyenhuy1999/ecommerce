import { headers } from 'next/headers'
import { getBulkJobs } from '@/features/bulk/api'
import { BulkPageClient } from './_components/BulkPage.client'

export default async function BulkPage() {
  const cookie = (await headers()).get('cookie')
  const init = { cache: 'no-store' as const, ...(cookie ? { headers: { cookie } } : {}) }
  const initialData = await getBulkJobs(undefined, init)
  return <BulkPageClient initialData={initialData} />
}
