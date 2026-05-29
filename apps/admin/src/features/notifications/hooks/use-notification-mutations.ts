'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNotification, sendNotification, createTemplate } from '../api/notifications.api'

function useInvalidateNotifications() {
  const qc = useQueryClient()
  return () => {
    void qc.invalidateQueries({ queryKey: ['notifications'] })
  }
}

export function useCreateNotification() {
  const invalidate = useInvalidateNotifications()
  return useMutation({ mutationFn: createNotification, onSuccess: invalidate })
}

export function useSendNotification() {
  const invalidate = useInvalidateNotifications()
  return useMutation({ mutationFn: sendNotification, onSuccess: invalidate })
}

export function useCreateTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createTemplate,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['notification-templates'] }),
  })
}
