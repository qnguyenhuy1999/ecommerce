'use client'

import { Button } from '@ecom/core-ui/atoms/Button'
import { Textarea } from '@ecom/core-ui/atoms/Textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@ecom/core-ui/molecules/Card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ecom/core-ui/molecules/Select'
import { startTransition, useDeferredValue, useMemo, useState } from 'react'
import { useControllableState } from '../../hooks'
import { SellerListPage } from '../../organisms/SellerListPage'
import { buildReviewsColumns } from './Reviews.columns'
import {
  REVIEWS_REPLY_FILTER_LABELS,
  REVIEWS_STATUS_LABELS,
  reviewsStatusTabs,
} from './Reviews.constants'
import { reviewsAnalytics, reviewsPageRows } from './Reviews.fixtures'
import type {
  ReviewAnalytics,
  ReviewsProps,
  ReviewsReplyFilter,
  ReviewsStatusTab,
} from './Reviews.types'
import { filterReviews } from './Reviews.utils'

interface ReviewsClientProps {
  rows: ReviewsProps['rows']
  analytics?: ReviewAnalytics
  loading?: ReviewsProps['loading']
  search?: ReviewsProps['search']
  onSearchChange?: ReviewsProps['onSearchChange']
  status?: ReviewsProps['status']
  onStatusChange?: ReviewsProps['onStatusChange']
  replyFilter?: ReviewsProps['replyFilter']
  onReplyFilterChange?: ReviewsProps['onReplyFilterChange']
  onReply?: ReviewsProps['onReply']
  emptyMessage?: ReviewsProps['emptyMessage']
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-muted-foreground text-sm">{label}</div>
        <div className="text-foreground mt-1 text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

function DistributionCard({ analytics }: { analytics: ReviewAnalytics }) {
  const max = Math.max(...analytics.ratingDistribution.map((d) => d.count), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Rating Distribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {[...analytics.ratingDistribution]
          .sort((a, b) => b.rating - a.rating)
          .map((d) => (
            <div key={d.rating} className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground w-6 text-right">{d.rating}★</span>
              <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                <div
                  className="h-2 rounded-full bg-yellow-400 transition-all"
                  style={{ width: `${(d.count / max) * 100}%` }}
                />
              </div>
              <span className="text-muted-foreground w-6">{d.count}</span>
            </div>
          ))}
      </CardContent>
    </Card>
  )
}

export function ReviewsClient({
  rows = reviewsPageRows,
  analytics = reviewsAnalytics,
  loading = false,
  search,
  onSearchChange,
  status,
  onStatusChange,
  replyFilter,
  onReplyFilterChange,
  onReply,
  emptyMessage = 'No reviews yet',
}: ReviewsClientProps) {
  const [currentSearch, setCurrentSearch] = useControllableState({
    defaultValue: search ?? '',
    ...(search !== undefined ? { value: search } : {}),
    ...(onSearchChange !== undefined ? { onChange: onSearchChange } : {}),
  })
  const [currentStatus, setCurrentStatus] = useControllableState<ReviewsStatusTab>({
    defaultValue: 'ALL',
    ...(status !== undefined ? { value: status } : {}),
    ...(onStatusChange !== undefined ? { onChange: onStatusChange } : {}),
  })
  const [currentReplyFilter, setCurrentReplyFilter] = useControllableState<ReviewsReplyFilter>({
    defaultValue: 'ALL',
    ...(replyFilter !== undefined ? { value: replyFilter } : {}),
    ...(onReplyFilterChange !== undefined ? { onChange: onReplyFilterChange } : {}),
  })

  const deferredSearch = useDeferredValue(currentSearch)

  const [replyingToId, setReplyingToId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  const columns = useMemo(() => buildReviewsColumns((id) => setReplyingToId(id)), [])

  const filtered = useMemo(
    () =>
      filterReviews({
        rows,
        search: deferredSearch,
        status: currentStatus,
        replyFilter: currentReplyFilter,
      }),
    [rows, deferredSearch, currentStatus, currentReplyFilter],
  )

  async function handleSendReply() {
    if (!replyingToId || !replyText.trim()) return
    await onReply?.(replyingToId, replyText.trim())
    setReplyingToId(null)
    setReplyText('')
  }

  const statusTabs = reviewsStatusTabs.map((tab) => ({
    value: tab,
    label: REVIEWS_STATUS_LABELS[tab],
  }))

  return (
    <div className="space-y-6">
      {/* Analytics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Reviews" value={analytics.totalReviews} />
        <StatCard label="Average Rating" value={analytics.averageRating.toFixed(1)} />
        <DistributionCard analytics={analytics} />
      </div>

      {/* Table */}
      <SellerListPage.Table
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage={emptyMessage}
        toolbar={
          <SellerListPage.Filters>
            <SellerListPage.Search
              value={currentSearch}
              onChange={(value) => {
                startTransition(() => setCurrentSearch(value))
              }}
              placeholder="Search reviews..."
            />
            <div className="flex flex-wrap items-center gap-2">
              <SellerListPage.StatusTabs
                tabs={statusTabs.map((t) => t.value)}
                value={currentStatus}
                onChange={(tab) => {
                  startTransition(() => setCurrentStatus(tab as ReviewsStatusTab))
                }}
              />
              <Select
                value={currentReplyFilter}
                onValueChange={(v) => setCurrentReplyFilter(v as ReviewsReplyFilter)}
              >
                <SelectTrigger className="h-10 w-40 rounded-2xl text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['ALL', 'HAS_REPLY', 'NO_REPLY'] as const).map((v) => (
                    <SelectItem key={v} value={v}>
                      {REVIEWS_REPLY_FILTER_LABELS[v]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </SellerListPage.Filters>
        }
      />

      {/* Inline reply */}
      {replyingToId ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Reply to review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  void handleSendReply()
                }}
                disabled={!replyText.trim()}
              >
                Send
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setReplyingToId(null)
                  setReplyText('')
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
