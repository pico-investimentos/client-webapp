import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { fetchCurrentUser, login, logout } from '@/features/auth/api/auth-api'
import { ApiError } from '@/shared/http/api-client'

export const currentUserQueryKey = ['auth', 'me'] as const

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: async () => {
      try {
        const response = await fetchCurrentUser()
        return response.data
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          return null
        }
        throw error
      }
    },
    retry: false,
    staleTime: 60_000,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: async (result) => {
      queryClient.setQueryData(currentUserQueryKey, result.data.user)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['auth', 'logout'],
    mutationFn: () => logout(),
    onSuccess: async () => {
      queryClient.setQueryData(currentUserQueryKey, null)
    },
  })
}
