import { useRef } from 'react'
import { Link2 } from 'lucide-react'
import { Button, Card } from '@heroui/react'
import { Link } from '@tanstack/react-router'

import { useCurrentUser } from '@/features/auth/hooks/use-auth'
import { mapB3ConfirmationError } from '@/features/b3/api/confirm-b3-authorization'
import { useConfirmB3Authorization } from '@/features/b3/hooks/use-confirm-b3-authorization'
import {
  mapB3AuthorizationError,
  useStartB3Authorization,
} from '@/features/b3/hooks/use-start-b3-authorization'
import type { B3ConnectionStatus } from '@/features/b3/types'
import { B3AuthorizationStartError } from '@/features/b3/types'

type B3ConnectionCardProps = {
  status?: B3ConnectionStatus
}

export function B3ConnectionCard({ status = 'NOT_CONNECTED' }: B3ConnectionCardProps) {
  const currentUser = useCurrentUser()
  const startAuthorization = useStartB3Authorization()
  const confirmAuthorization = useConfirmB3Authorization()
  const isSubmittingRef = useRef(false)

  const handleConnect = () => {
    if (startAuthorization.isPending || isSubmittingRef.current || !currentUser.data) {
      return
    }

    isSubmittingRef.current = true
    startAuthorization.mutate(undefined, {
      onSettled: () => {
        isSubmittingRef.current = false
      },
    })
  }

  const handleRefreshStatus = () => {
    if (confirmAuthorization.isPending || !currentUser.data) {
      return
    }

    confirmAuthorization.mutate()
  }

  const errorMessage = startAuthorization.isError
    ? mapB3AuthorizationError(startAuthorization.error)
    : confirmAuthorization.isError
      ? mapB3ConfirmationError(confirmAuthorization.error)
      : null
  const requestId =
    startAuthorization.error instanceof B3AuthorizationStartError
      ? startAuthorization.error.requestId
      : undefined

  if (status === 'AUTHORIZED') {
    return (
      <Card className="surface-card rounded-[24px] bg-white p-0">
        <Card.Content className="p-6 sm:p-7">
          <h2 className="text-lg font-semibold tracking-[-0.025em] text-slate-950">
            Carteira B3 conectada
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Sua autorização já foi confirmada. A sincronização dos dados será tratada nos próximos
            passos.
          </p>
        </Card.Content>
      </Card>
    )
  }

  if (status === 'AUTHORIZATION_REQUESTED') {
    return (
      <Card className="surface-card rounded-[24px] bg-white p-0">
        <Card.Content className="p-6 sm:p-7">
          <h2 id="b3-connection-title" className="text-lg font-semibold tracking-[-0.025em] text-slate-950">
            Autorização iniciada
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Você já foi encaminhado ao ambiente da B3. A Pico ainda precisa confirmar a autorização
            antes de marcar a conta como conectada.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              type="button"
              variant="primary"
              className="min-h-10 rounded-xl bg-[#0f6b57] text-white"
              isDisabled={startAuthorization.isPending || !currentUser.data}
              aria-busy={startAuthorization.isPending}
              onPress={handleConnect}
            >
              {startAuthorization.isPending ? 'Abrindo ambiente da B3...' : 'Continuar na B3'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="min-h-10 rounded-xl"
              isDisabled={confirmAuthorization.isPending || !currentUser.data}
              aria-busy={confirmAuthorization.isPending}
              onPress={handleRefreshStatus}
            >
              {confirmAuthorization.isPending ? 'Atualizando...' : 'Atualizar status'}
            </Button>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Consulta a B3 para verificar se sua autorização já foi registrada. Se ainda não
            aparecer, aguarde alguns minutos e tente novamente.
          </p>
          {confirmAuthorization.isSuccess && confirmAuthorization.data.data.possiblyRevoked ? (
            <p className="mt-3 text-sm text-amber-800" role="status">
              Não encontramos mais sua autorização na B3. Confirme a revogação em{' '}
              <Link
                to="/b3/revoke-authorization"
                className="font-semibold underline underline-offset-2"
              >
                Saiba como revogar
              </Link>
              .
            </p>
          ) : null}
          {confirmAuthorization.isSuccess &&
          !confirmAuthorization.data.data.confirmed &&
          !confirmAuthorization.data.data.possiblyRevoked ? (
            <p className="mt-3 text-sm text-slate-600" role="status">
              Ainda não encontramos sua autorização na B3. Se você já concluiu o opt-in, tente
              novamente em breve.
            </p>
          ) : null}
          {errorMessage ? (
            <div className="mt-3 space-y-1">
              <p role="alert" className="text-sm text-red-600">
                {errorMessage}
              </p>
              {requestId ? (
                <p className="text-xs text-slate-500">Código de referência: {requestId}</p>
              ) : null}
            </div>
          ) : null}
        </Card.Content>
      </Card>
    )
  }

  if (status === 'REVOKED') {
    return (
      <Card className="surface-card rounded-[24px] bg-white p-0">
        <Card.Content className="p-6 sm:p-7">
          <h2 id="b3-connection-title" className="text-lg font-semibold tracking-[-0.025em] text-slate-950">
            Autorização revogada
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Sua autorização com a B3 foi revogada. Você pode iniciar uma nova conexão quando quiser.
          </p>
          <Button
            type="button"
            variant="primary"
            className="mt-5 min-h-10 rounded-xl bg-[#0f6b57] text-white"
            isDisabled={startAuthorization.isPending || !currentUser.data}
            aria-busy={startAuthorization.isPending}
            onPress={handleConnect}
          >
            {startAuthorization.isPending ? 'Abrindo ambiente da B3...' : 'Reconectar com a B3'}
          </Button>
          {errorMessage ? (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {errorMessage}
            </p>
          ) : null}
        </Card.Content>
      </Card>
    )
  }

  if (status === 'ERROR') {
    return (
      <Card className="surface-card rounded-[24px] bg-white p-0">
        <Card.Content className="p-6 sm:p-7">
          <h2 id="b3-connection-title" className="text-lg font-semibold tracking-[-0.025em] text-slate-950">
            Problema na conexão B3
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Ocorreu um problema na última tentativa de autorização. Você pode tentar novamente.
          </p>
          <Button
            type="button"
            variant="primary"
            className="mt-5 min-h-10 rounded-xl bg-[#0f6b57] text-white"
            isDisabled={startAuthorization.isPending || !currentUser.data}
            aria-busy={startAuthorization.isPending}
            onPress={handleConnect}
          >
            {startAuthorization.isPending ? 'Abrindo ambiente da B3...' : 'Tentar novamente'}
          </Button>
          {errorMessage ? (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {errorMessage}
            </p>
          ) : null}
        </Card.Content>
      </Card>
    )
  }

  const missingCpf = currentUser.data?.hasCpf === false
  const isUnauthenticated = !currentUser.isLoading && !currentUser.data
  const buttonLabel = startAuthorization.isPending
    ? 'Abrindo ambiente da B3...'
    : startAuthorization.isError
      ? 'Tentar novamente'
      : 'Conectar com a B3'

  return (
    <Card className="surface-card rounded-[24px] bg-white p-0">
      <Card.Content className="p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#e7f2ee] text-[#176b58]">
            <Link2 size={20} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2
              id="b3-connection-title"
              className="text-lg font-semibold tracking-[-0.025em] text-slate-950"
            >
              Conecte sua carteira da B3
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Você será direcionado ao ambiente oficial da B3 para autorizar o compartilhamento dos
              seus dados de investimento com a Pico Investimentos. Sua senha da B3 não será
              informada à Pico.
            </p>

            {isUnauthenticated ? (
              <div className="mt-5">
                <p className="text-sm text-slate-600">Faça login para iniciar a conexão com a B3.</p>
                <Link
                  to="/login"
                  className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-[#0f6b57]"
                >
                  Entrar
                </Link>
              </div>
            ) : missingCpf ? (
              <div className="mt-5">
                <p className="text-sm text-slate-600">
                  Complete seu CPF no perfil antes de iniciar a conexão.
                </p>
                <Link
                  to="/profile"
                  className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-[#0f6b57]"
                >
                  Completar cadastro
                </Link>
              </div>
            ) : (
              <Button
                type="button"
                variant="primary"
                className="mt-5 min-h-10 rounded-xl bg-[#0f6b57] text-white"
                isDisabled={startAuthorization.isPending || currentUser.isLoading}
                aria-busy={startAuthorization.isPending}
                onPress={handleConnect}
              >
                {buttonLabel}
              </Button>
            )}

            <Link
              to="/privacy"
              className="mt-4 inline-flex min-h-10 items-center text-sm font-medium text-slate-600 underline-offset-4 hover:text-[#0f6b57] hover:underline"
            >
              Saiba como tratamos os dados da B3
            </Link>

            {errorMessage ? (
              <div className="mt-3 space-y-1" aria-live="polite">
                <p role="alert" className="text-sm text-red-600">
                  {errorMessage}
                </p>
                {requestId ? (
                  <p className="text-xs text-slate-500">Código de referência: {requestId}</p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}
