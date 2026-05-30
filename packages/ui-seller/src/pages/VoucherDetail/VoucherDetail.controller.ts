'use client'

import { useCallback, useState } from 'react'
import { generateVoucherCode, normalizeVoucherCode } from './VoucherDetail.constants'
import type {
  VoucherDetailFormData,
  VoucherDetailProps,
  VoucherDetailType,
} from './VoucherDetail.types'

type VoucherDetailControllerProps = Omit<
  Pick<VoucherDetailProps, 'initialData' | 'onSubmit' | 'onCancel'>,
  'initialData'
> & { initialData: VoucherDetailFormData }

export function useVoucherDetailController({
  initialData,
  onSubmit,
  onCancel,
}: VoucherDetailControllerProps) {
  const [form, setForm] = useState<VoucherDetailFormData>(initialData)

  const updateForm = useCallback(
    <K extends keyof VoucherDetailFormData>(key: K, value: VoucherDetailFormData[K]) => {
      setForm((current) => ({ ...current, [key]: value }))
    },
    [],
  )

  const handleGenerateCode = useCallback(() => {
    setForm((current) => ({ ...current, code: generateVoucherCode() }))
  }, [])

  const handleTypeChange = useCallback((value: VoucherDetailType) => {
    setForm((current) => ({ ...current, type: value }))
  }, [])

  const handleCodeChange = useCallback((raw: string) => {
    setForm((current) => ({ ...current, code: normalizeVoucherCode(raw) }))
  }, [])

  const handleSubmit = useCallback(() => {
    onSubmit?.(form)
  }, [form, onSubmit])

  return {
    state: { form },
    handlers: {
      updateForm,
      handleGenerateCode,
      handleTypeChange,
      handleCodeChange,
      handleSubmit,
      onCancel,
    },
  }
}
