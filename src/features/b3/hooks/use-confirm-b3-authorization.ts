import { useMutation, useQueryClient } from '@tanstack/react-query'

import { confirmB3Authorization } from '@/features/b3/api/confirm-b3-authorization'
import { b3ConnectionQueryKey } from '@/features/b3/hooks/use-b3-connection'

export function useConfirmB3Authorization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['b3', 'connection', 'confirm'],
    mutationFn: confirmB3Authorization,
    onSuccess: ({ data }) => {
      queryClient.setQueryData(b3ConnectionQueryKey, {
        status: data.status,
        authorizationRequestedAt: data.authorizationRequestedAt,
        authorizedAt: data.authorizedAt,
        revokedAt: data.revokedAt,
        lastCheckedAt: data.lastCheckedAt,
      })
    },
  })
}
