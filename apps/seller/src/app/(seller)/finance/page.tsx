import { headers } from 'next/headers'
import { getFinanceBundle } from '@/features/finance/api'
import { buildFinanceProps } from '@/features/finance/mappers'
import { FinancePageClient } from './_components/FinancePage.client'

export default async function FinancePage() {
  const cookie = (await headers()).get('cookie')
  const init = { cache: 'no-store' as const, ...(cookie ? { headers: { cookie } } : {}) }
  const bundle = await getFinanceBundle(init)
  const initialData = buildFinanceProps(bundle)
  return <FinancePageClient initialData={initialData} />
}
