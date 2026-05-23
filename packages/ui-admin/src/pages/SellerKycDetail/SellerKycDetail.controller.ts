import { useCallback, useState } from 'react'
import type { SellerKycDetailRecord, SellerKycDetailSection } from './SellerKycDetail.types'

export function useSellerKycDetailController(item: SellerKycDetailRecord) {
  const [activeSection, setActiveSection] = useState<SellerKycDetailSection>(
    item.tabs[0]?.value ?? 'KYC_REVIEW',
  )

  const handleSectionChange = useCallback((value: string) => {
    setActiveSection(value as SellerKycDetailSection)
  }, [])

  return {
    state: { activeSection },
    handlers: { handleSectionChange },
  }
}
