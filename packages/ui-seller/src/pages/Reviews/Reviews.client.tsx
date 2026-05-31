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
import type { ReviewRow, ReviewsReplyFilter, ReviewsStatusTab } from './Reviews.types'
import { filterReviews } from './Reviews.utils'

interface ReviewsClientProps {
  rows: ReviewRow[]
  loading: boolean
  search: string | undefined
  onSearchChange: ((value: string) => void) | undefined
  status: ReviewsStatusTab | undefined
  onStatusChange: ((value: ReviewsStatusTab) => void) | undefined
  replyFilter: ReviewsReplyFilter | undefined
  onReplyFilterChange: ((value: ReviewsReplyFilter) => void) | undefined
  onReply: ((reviewId: string, message: string) => void | Promise<void>) | undefined
  emptyMessage: string
}

export function ReviewsClient({
  rows,
  loading,
  search,
  onSearchChange,
  status,
  onStatusChange,
  replyFilter,
  onReplyFilterChange,
  onReply,
  emptyMessage,
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
              aria-label="Reply message"
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
