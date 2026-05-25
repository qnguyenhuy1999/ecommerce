import { RefundDetailPageClient } from './DisputeDetailPage.client'

export default async function RefundDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <RefundDetailPageClient id={id} />
}
