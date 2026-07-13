import { useMutation, useQueryClient } from '@tanstack/react-query'

import { revokeB3Authorization } from '@/features/b3/api/revoke-b3-authorization'
import { b3ConnectionQueryKey } from '@/features/b3/hooks/use-b3-connection'

export function useRevokeB3Authorization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['b3', 'connection', 'revoke'],
    mutationFn: (password: string) => revokeB3Authorization(password),
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
