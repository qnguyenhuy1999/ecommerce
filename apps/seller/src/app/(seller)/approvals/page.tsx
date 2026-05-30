import { headers } from 'next/headers'
import { getApprovals } from '@/features/approvals/api'
import { mapApprovalsToRows } from '@/features/approvals/mappers'
import { ApprovalsPageClient } from './_components/ApprovalsPage.client'

export default async function ApprovalsPage() {
  const cookie = (await headers()).get('cookie')
  const init = { cache: 'no-store' as const, ...(cookie ? { headers: { cookie } } : {}) }
  const items = await getApprovals(undefined, init)
  const initialData = mapApprovalsToRows(items)
  return <ApprovalsPageClient initialData={initialData} />
}
