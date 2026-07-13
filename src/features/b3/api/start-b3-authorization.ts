import { env } from '@/config/env'

import {
  B3AuthorizationStartError,
  type StartB3AuthorizationResponse,
} from '@/features/b3/types'

let pendingIdempotencyKey: string | null = null

export function resetB3AuthorizationIdempotencyKey() {
  pendingIdempotencyKey = null
}

export async function startB3Authorization(): Promise<StartB3AuthorizationResponse> {
  if (!pendingIdempotencyKey) {
    pendingIdempotencyKey = crypto.randomUUID()
  }

  const response = await fetch(`${env.apiUrl}/api/v1/integrations/b3/authorization-attempts`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Idempotency-Key': pendingIdempotencyKey,
    },
    body: JSON.stringify({}),
  })

  const payload = (await response.json().catch(() => null)) as {
    data?: StartB3AuthorizationResponse['data']
    error?: { code?: string; message?: string; requestId?: string }
  } | null

  if (!response.ok) {
    pendingIdempotencyKey = null
    throw new B3AuthorizationStartError(
      response.status,
      payload?.error?.code ?? 'UNKNOWN_ERROR',
      payload?.error?.message ?? 'Não foi possível iniciar a conexão com a B3.',
      payload?.error?.requestId,
    )
  }

  if (!payload?.data) {
    pendingIdempotencyKey = null
    throw new B3AuthorizationStartError(
      response.status,
      'UNKNOWN_ERROR',
      'Resposta inválida ao iniciar a conexão com a B3.',
    )
  }

  pendingIdempotencyKey = null
  return { data: payload.data }
}
