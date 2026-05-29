'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { loginAdmin, logoutAdmin } from '../api/auth.api'
import { resetChatSocketManager } from '../../chat/utils/chat-socket-manager'

export function useLogin() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginAdmin(email, password),
    onSuccess: (res) => {
      queryClient.setQueryData(['admin-profile'], res.data)
      router.push('/')
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: logoutAdmin,
    onSuccess: () => {
      resetChatSocketManager()
      queryClient.clear()
      router.push('/login')
    },
  })
}
