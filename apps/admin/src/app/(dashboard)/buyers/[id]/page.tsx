import { UserDetailPageClient } from './UserDetailPage.client'

export default async function BuyerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <UserDetailPageClient id={id} />
}
