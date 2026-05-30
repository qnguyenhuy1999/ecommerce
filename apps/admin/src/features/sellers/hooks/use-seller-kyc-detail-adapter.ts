'use client'

import type {
  SellerKycDetailRecord,
  SellerKycDetailDocumentActionPayload,
} from '@ecom/ui-admin/pages/SellerKycDetail'
import {
  useSellerDetail,
  useApproveSeller,
  useRejectSeller,
  useSuspendSeller,
} from '../hooks/use-sellers'
import { mapSellerDetailToKycDetail } from '../mappers/seller-kyc.mapper'

export function useSellerKycDetailAdapter(id: string) {
  const detailQuery = useSellerDetail(id)
  const approve = useApproveSeller()
  const reject = useRejectSeller()
  const suspend = useSuspendSeller()

  const item = detailQuery.data ? mapSellerDetailToKycDetail(detailQuery.data) : undefined

  return {
    loading: detailQuery.isPending,
    error: detailQuery.error,
    ...(item !== undefined && { item }),
    backHref: '/sellers',
    onApproveSeller: async () => {
      await approve.mutateAsync(id)
    },
    onRejectSeller: async (record: SellerKycDetailRecord) => {
      await reject.mutateAsync({ id: record.id })
    },
    onApproveDocument: async (payload: SellerKycDetailDocumentActionPayload) => {
      await approve.mutateAsync(payload.item.id)
    },
    onRejectDocument: async (payload: SellerKycDetailDocumentActionPayload) => {
      await suspend.mutateAsync({ id: payload.item.id })
    },
  }
}
