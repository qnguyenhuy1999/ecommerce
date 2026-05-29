'use client'

import { useCallback, useEffect, useState } from 'react'
import { Reviews, type ReviewAnalytics, type ReviewRow } from '@ecom/ui-seller'
import { getReviewsBundle, replyToReview } from '@/features/reviews/api'
import { mapReviewsToRows } from '@/features/reviews/mappers'

export default function ReviewsPage() {
  const [rows, setRows] = useState<ReviewRow[]>([])
  const [analytics, setAnalytics] = useState<ReviewAnalytics | undefined>()
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const bundle = await getReviewsBundle()
        setRows(mapReviewsToRows(bundle.reviews))
        setAnalytics(bundle.analytics)
      } catch {
        setRows([])
        setAnalytics(undefined)
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
  }, [refreshKey])

  const handleReply = useCallback(async (reviewId: string, message: string) => {
    await replyToReview(reviewId, message)
    setRefreshKey((current) => current + 1)
  }, [])

  return (
    <Reviews
      rows={rows}
      {...(analytics !== undefined ? { analytics } : {})}
      loading={loading}
      onReply={handleReply}
    />
  )
}
