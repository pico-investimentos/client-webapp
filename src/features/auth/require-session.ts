import { redirect } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

import { currentUserQueryKey } from '@/features/auth/hooks/use-auth'
import { fetchCurrentUser } from '@/features/auth/api/auth-api'
import type { SessionUser } from '@/features/auth/api/auth-api'
import { ApiError } from '@/shared/http/api-client'

export async function fetchSessionUser(): Promise<SessionUser | null> {
  try {
    const response = await fetchCurrentUser()
    return response.data
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null
    }
    throw error
  }
}

export async function requireSession(queryClient: QueryClient) {
  const user = await queryClient.ensureQueryData({
    queryKey: currentUserQueryKey,
    queryFn: fetchSessionUser,
  })

  if (!user) {
    throw redirect({ to: '/login' })
  }

  return user
}
