import { createFileRoute, redirect } from '@tanstack/react-router'

import { LoginForm } from '@/features/auth/components/login-form'
import { currentUserQueryKey } from '@/features/auth/hooks/use-auth'
import { fetchSessionUser } from '@/features/auth/require-session'

export const Route = createFileRoute('/login')({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData({
      queryKey: currentUserQueryKey,
      queryFn: fetchSessionUser,
    })

    if (user) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginForm,
})
