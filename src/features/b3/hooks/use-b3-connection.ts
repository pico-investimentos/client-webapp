import { useQuery } from '@tanstack/react-query'

import { fetchB3Connection } from '@/features/b3/api/get-b3-connection'
import { ApiError } from '@/shared/http/api-client'

export const b3ConnectionQueryKey = ['b3', 'connection'] as const

export function useB3Connection(enabled = true) {
  return useQuery({
    queryKey: b3ConnectionQueryKey,
    enabled,
    queryFn: async () => {
      try {
        const response = await fetchB3Connection()
        return response.data
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          return null
        }
        throw error
      }
    },
    retry: false,
    staleTime: 30_000,
  })
}
