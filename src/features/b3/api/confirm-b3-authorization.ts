import { env } from '@/config/env'
import { ApiError } from '@/shared/http/api-client'
import type { B3ConnectionStatus } from '@/features/b3/types'

export type ConfirmB3AuthorizationResponse = {
  data: {
    status: B3ConnectionStatus
    authorizationRequestedAt: string | null
    authorizedAt: string | null
    revokedAt: string | null
    lastCheckedAt: string | null
    confirmed: boolean
    possiblyRevoked: boolean
  }
}

export class B3AuthorizationConfirmError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly requestId?: string,
  ) {
    super(message)
    this.name = 'B3AuthorizationConfirmError'
  }
}

export async function confirmB3Authorization(): Promise<ConfirmB3AuthorizationResponse> {
  const response = await fetch(`${env.apiUrl}/api/v1/integrations/b3/connection/confirmation`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  })

  const payload = (await response.json().catch(() => null)) as {
    data?: ConfirmB3AuthorizationResponse['data']
    error?: { code?: string; message?: string; requestId?: string }
  } | null

  if (!response.ok) {
    throw new B3AuthorizationConfirmError(
      response.status,
      payload?.error?.code ?? 'UNKNOWN_ERROR',
      payload?.error?.message ?? 'Não foi possível atualizar o status da conexão B3.',
      payload?.error?.requestId,
    )
  }

  if (!payload?.data) {
    throw new B3AuthorizationConfirmError(
      response.status,
      'UNKNOWN_ERROR',
      'Resposta inválida ao confirmar a conexão B3.',
    )
  }

  return { data: payload.data }
}

export function mapB3ConfirmationError(error: unknown): string {
  if (error instanceof B3AuthorizationConfirmError) {
    switch (error.code) {
      case 'CPF_REQUIRED':
        return 'Complete seu CPF no cadastro antes de atualizar o status.'
      case 'B3_AUTHORIZATION_CONFIRMATION_UNAVAILABLE':
        return 'Não foi possível consultar a B3 agora. Tente novamente em instantes.'
      case 'UNAUTHENTICATED':
        return 'Faça login para atualizar o status da conexão.'
      default:
        return 'Não foi possível atualizar o status da conexão B3.'
    }
  }

  if (error instanceof ApiError) {
    return 'Não foi possível atualizar o status da conexão B3.'
  }

  return 'Não foi possível atualizar o status da conexão B3.'
}
