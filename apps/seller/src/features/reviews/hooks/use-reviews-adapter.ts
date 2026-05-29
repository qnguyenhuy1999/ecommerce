'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getReviewsBundle, replyToReview } from '../api'
import { mapReviewsToRows } from '../mappers'
import { reviewKeys } from '../query-keys'

export function useReviewsAdapter() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: reviewKeys.bundle(),
    queryFn: async () => {
      const bundle = await getReviewsBundle()
      return {
        rows: mapReviewsToRows(bundle.reviews),
        analytics: bundle.analytics,
      }
    },
  })

  const replyMutation = useMutation({
    mutationFn: ({ reviewId, message }: { reviewId: string; message: string }) =>
      replyToReview(reviewId, message),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: reviewKeys.all }),
  })

  return {
    loading: query.isPending,
    error: query.error,
    rows: query.data?.rows ?? [],
    analytics: query.data?.analytics,
    onReply: (reviewId: string, message: string) =>
      replyMutation.mutateAsync({ reviewId, message }),
  }
}
