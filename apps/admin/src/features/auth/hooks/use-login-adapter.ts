'use client'

import type { LoginProps, LoginSubmitValues } from '@ecom/ui-admin/pages/Login'
import { useLogin } from '../hooks/use-auth-mutations'

export function useLoginAdapter(): Pick<LoginProps, 'onSubmit'> {
  const login = useLogin()

  return {
    onSubmit: async (values: LoginSubmitValues) => {
      await login.mutateAsync({ email: values.email, password: values.password })
    },
  }
}
