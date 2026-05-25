'use client'

import { useState, useEffect, useCallback } from 'react'
import { DashboardLayout } from '../../components/dashboard-layout'
import { Reviews } from '@ecom/ui-seller'
import { api } from '../../lib/api'
import type { ReviewRow, ReviewAnalytics } from '@ecom/ui-seller'

interface ApiReview {
  id: string
  rating: number
  title: string | null
  comment: string | null
  status: string
  createdAt: string
  replies: { id: string; message: string }[]
}

interface ReviewsResponse {
  data: ApiReview[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

function toReviewRow(r: ApiReview): ReviewRow {
  return {
    id: r.id,
    rating: r.rating as ReviewRow['rating'],
    title: r.title,
    comment: r.comment,
    status: r.status as ReviewRow['status'],
    hasReply: r.replies.length > 0,
    replyMessage: r.replies[0]?.message ?? null,
    createdAtLabel: new Date(r.createdAt).toLocaleDateString(),
  }
}

export default function ReviewsPage() {
  const [rows, setRows] = useState<ReviewRow[]>([])
  const [analytics, setAnalytics] = useState<ReviewAnalytics | undefined>()
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [reviewsRes, analyticsRes] = await Promise.all([
          api<ReviewsResponse>('/reviews', { params: { limit: 100 } }),
          api<ReviewAnalytics>('/reviews/analytics'),
        ])
        setRows(reviewsRes.data.map(toReviewRow))
        setAnalytics(analyticsRes)
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }
    void fetchData()
  }, [refreshKey])

  const handleReply = useCallback(async (reviewId: string, message: string) => {
    await api(`/reviews/${reviewId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    })
    setRefreshKey((k) => k + 1)
  }, [])

  return (
    <DashboardLayout>
      <Reviews
        rows={rows}
        {...(analytics !== undefined && { analytics })}
        loading={loading}
        onReply={handleReply}
      />
    </DashboardLayout>
  )
}
