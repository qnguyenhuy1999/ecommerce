import { SellerDetailPageClient } from './SellerDetailPage.client'

export default async function SellerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <SellerDetailPageClient id={id} />
}
