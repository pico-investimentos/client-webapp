import { apiRequest } from '@/shared/http/api-client'
import type { B3ConnectionStatus } from '@/features/b3/types'

export type B3ConnectionResponse = {
  data: {
    status: B3ConnectionStatus
    authorizationRequestedAt: string | null
    authorizedAt: string | null
    revokedAt: string | null
    lastCheckedAt: string | null
  }
}

export async function fetchB3Connection() {
  return apiRequest<B3ConnectionResponse>('api/v1/integrations/b3/connection')
}
