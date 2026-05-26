import { OrderDetailPageClient } from './OrderDetailPage.client'

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <OrderDetailPageClient id={id} />
}
