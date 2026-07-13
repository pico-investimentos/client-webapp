import { useMutation, useQueryClient } from '@tanstack/react-query'

import { startB3Authorization } from '@/features/b3/api/start-b3-authorization'
import { b3ConnectionQueryKey } from '@/features/b3/hooks/use-b3-connection'
import { B3AuthorizationStartError } from '@/features/b3/types'

export function isAllowedB3AuthorizationUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:'
  } catch {
    return false
  }
}

export function mapB3AuthorizationError(error: unknown): string {
  if (!(error instanceof B3AuthorizationStartError)) {
    return 'Não foi possível iniciar a conexão com a B3. Tente novamente.'
  }

  switch (error.code) {
    case 'CPF_REQUIRED':
      return 'Complete seu CPF no cadastro antes de conectar com a B3.'
    case 'CPF_INVALID':
      return 'O CPF cadastrado é inválido. Atualize seus dados e tente novamente.'
    case 'B3_ALREADY_AUTHORIZED':
      return 'Sua conta já está conectada à B3.'
    case 'USER_NOT_ELIGIBLE':
      return 'Sua conta não está elegível para conectar com a B3. Entre em contato com o suporte.'
    case 'TOO_MANY_ATTEMPTS':
      return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
    case 'B3_AUTHORIZATION_START_UNAVAILABLE':
    case 'B3_OPT_IN_CONFIGURATION_INVALID':
      return 'A conexão com a B3 está temporariamente indisponível.'
    case 'UNAUTHENTICATED':
      return 'Faça login para conectar sua conta à B3.'
    default:
      return 'Não foi possível iniciar a conexão com a B3. Tente novamente.'
  }
}

export function useStartB3Authorization(options?: {
  assignLocation?: (url: string) => void
}) {
  const queryClient = useQueryClient()
  const assignLocation =
    options?.assignLocation ??
    ((url: string) => {
      window.location.assign(url)
    })

  return useMutation({
    mutationKey: ['b3', 'authorization', 'start'],
    mutationFn: startB3Authorization,
    onSuccess: ({ data }) => {
      queryClient.setQueryData(b3ConnectionQueryKey, {
        status: data.connectionStatus,
        authorizationRequestedAt: new Date().toISOString(),
        authorizedAt: null,
        revokedAt: null,
        lastCheckedAt: null,
      })

      if (!isAllowedB3AuthorizationUrl(data.authorizationUrl)) {
        throw new B3AuthorizationStartError(
          500,
          'INVALID_B3_AUTHORIZATION_URL',
          'A URL de autorização retornada é inválida.',
        )
      }

      assignLocation(data.authorizationUrl)
    },
    onError: (error) => {
      if (
        error instanceof B3AuthorizationStartError &&
        error.code === 'B3_ALREADY_AUTHORIZED'
      ) {
        queryClient.setQueryData(b3ConnectionQueryKey, {
          status: 'AUTHORIZED',
          authorizationRequestedAt: null,
          authorizedAt: new Date().toISOString(),
          revokedAt: null,
          lastCheckedAt: null,
        })
      }
    },
  })
}
