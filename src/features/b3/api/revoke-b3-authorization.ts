import { env } from '@/config/env'
import { ApiError } from '@/shared/http/api-client'
import type { B3ConnectionStatus } from '@/features/b3/types'

export type RevokeB3AuthorizationResponse = {
  data: {
    status: B3ConnectionStatus
    authorizationRequestedAt: string | null
    authorizedAt: string | null
    revokedAt: string | null
    lastCheckedAt: string | null
  }
}

export class B3AuthorizationRevokeError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly requestId?: string,
  ) {
    super(message)
    this.name = 'B3AuthorizationRevokeError'
  }
}

export async function revokeB3Authorization(
  password: string,
): Promise<RevokeB3AuthorizationResponse> {
  const response = await fetch(`${env.apiUrl}/api/v1/integrations/b3/connection/revocation`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  })

  const payload = (await response.json().catch(() => null)) as {
    data?: RevokeB3AuthorizationResponse['data']
    error?: { code?: string; message?: string; requestId?: string }
  } | null

  if (!response.ok) {
    throw new B3AuthorizationRevokeError(
      response.status,
      payload?.error?.code ?? 'UNKNOWN_ERROR',
      payload?.error?.message ?? 'Não foi possível revogar a autorização B3.',
      payload?.error?.requestId,
    )
  }

  if (!payload?.data) {
    throw new B3AuthorizationRevokeError(
      response.status,
      'UNKNOWN_ERROR',
      'Resposta inválida ao revogar a autorização B3.',
    )
  }

  return { data: payload.data }
}

export function mapB3RevocationError(error: unknown): string {
  if (error instanceof B3AuthorizationRevokeError) {
    switch (error.code) {
      case 'INVALID_CREDENTIALS':
        return 'Senha incorreta. Confira e tente novamente.'
      case 'CPF_REQUIRED':
        return 'Complete seu CPF no cadastro antes de revogar.'
      case 'B3_NOT_REVOCABLE':
        return 'Não há autorização B3 ativa para revogar.'
      case 'B3_ALREADY_REVOKED':
        return 'A autorização B3 já está revogada.'
      case 'B3_AUTHORIZATION_REVOCATION_UNAVAILABLE':
        return 'Não foi possível falar com a B3 agora. Tente novamente em instantes.'
      case 'TOO_MANY_REVOCATIONS':
      case 'TOO_MANY_ATTEMPTS':
        return 'Muitas tentativas de revogação. Aguarde alguns minutos e tente de novo.'
      case 'UNAUTHENTICATED':
      case 'UNAUTHORIZED':
        return 'Faça login para revogar a autorização.'
      default:
        return 'Não foi possível revogar a autorização B3.'
    }
  }

  if (error instanceof ApiError) {
    return 'Não foi possível revogar a autorização B3.'
  }

  return 'Não foi possível revogar a autorização B3.'
}
