import { useRef } from 'react'
import { Button } from '@heroui/react'
import { Link } from '@tanstack/react-router'

import { useCurrentUser } from '@/features/auth/hooks/use-auth'
import { mapB3ConfirmationError } from '@/features/b3/api/confirm-b3-authorization'
import { B3Logo } from '@/features/b3/components/b3-logo'
import { useConfirmB3Authorization } from '@/features/b3/hooks/use-confirm-b3-authorization'
import { useB3Connection } from '@/features/b3/hooks/use-b3-connection'
import {
  mapB3AuthorizationError,
  useStartB3Authorization,
} from '@/features/b3/hooks/use-start-b3-authorization'
import { getB3StatusPresentation } from '@/features/b3/lib/b3-status-presentation'
import { B3AuthorizationStartError } from '@/features/b3/types'

export function B3HeaderStatus() {
  const currentUser = useCurrentUser()
  const enabled = Boolean(currentUser.data)
  const connection = useB3Connection(enabled)
  const startAuthorization = useStartB3Authorization()
  const confirmAuthorization = useConfirmB3Authorization()
  const isSubmittingRef = useRef(false)

  if (!enabled) {
    return null
  }

  const status = connection.data?.status ?? 'NOT_CONNECTED'
  const presentation = getB3StatusPresentation(status)
  const StatusIcon = presentation.Icon
  const isBusy =
    startAuthorization.isPending ||
    confirmAuthorization.isPending ||
    connection.isFetching

  const handleConnect = () => {
    if (isBusy || isSubmittingRef.current || !currentUser.data) {
      return
    }

    isSubmittingRef.current = true
    startAuthorization.mutate(undefined, {
      onSettled: () => {
        isSubmittingRef.current = false
      },
    })
  }

  const handleRefresh = () => {
    if (isBusy || !currentUser.data) {
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

  const primaryActionLabel =
    status === 'AUTHORIZED'
      ? null
      : status === 'AUTHORIZATION_REQUESTED'
        ? 'Continuar na B3'
        : status === 'REVOKED'
          ? 'Reconectar com a B3'
          : status === 'ERROR'
            ? 'Tentar novamente'
            : 'Conectar com a B3'

  return (
    <div className="group relative">
      <button
        type="button"
        className="b3-header-trigger"
        aria-haspopup="dialog"
        aria-label={`Status da conexão B3: ${presentation.label}`}
      >
        <B3Logo className="size-8 shrink-0 rounded-lg object-cover shadow-[0_0_0_1px_rgba(15,23,42,0.08)]" />
        <span
          className={`absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full text-white shadow-[0_0_0_2px_#f4f7f5] ${presentation.toneClass}`}
          aria-hidden="true"
        >
          <StatusIcon size={10} strokeWidth={2.4} />
        </span>
      </button>

      <div className="b3-header-panel" role="dialog" aria-label="Ações da conexão B3">
        <div className="flex items-start gap-3">
          <B3Logo className="mt-0.5 size-10 shrink-0 rounded-xl object-cover shadow-[0_0_0_1px_rgba(15,23,42,0.08)]" />
          <div className="min-w-0 flex-1">
            <div className={`flex items-center gap-1.5 text-sm font-semibold ${presentation.iconClass}`}>
              <StatusIcon size={15} strokeWidth={2} aria-hidden="true" />
              <span>{presentation.label}</span>
            </div>
            <p className="mt-1.5 text-pretty text-xs leading-5 text-slate-600">
              {presentation.description}
            </p>
          </div>
        </div>

        {status === 'AUTHORIZED' ? (
          <p
            className="mt-4 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-medium leading-5 text-emerald-800"
            role="status"
          >
            Tudo certo. Sua carteira B3 está autorizada para a Pico.
          </p>
        ) : null}

        <div className="mt-4 flex flex-col gap-2">
          {primaryActionLabel ? (
            <Button
              type="button"
              variant="primary"
              className="min-h-10 w-full rounded-xl bg-[#0f6b57] text-white"
              isDisabled={isBusy || currentUser.data?.hasCpf === false}
              aria-busy={startAuthorization.isPending}
              onPress={handleConnect}
            >
              {startAuthorization.isPending ? 'Abrindo ambiente da B3...' : primaryActionLabel}
            </Button>
          ) : null}

          <Button
            type="button"
            variant="secondary"
            className="min-h-10 w-full rounded-xl"
            isDisabled={isBusy}
            aria-busy={confirmAuthorization.isPending}
            onPress={handleRefresh}
          >
            {confirmAuthorization.isPending
              ? 'Atualizando...'
              : status === 'NOT_CONNECTED'
                ? 'Já autorizei — atualizar status'
                : 'Atualizar status'}
          </Button>

          {currentUser.data?.hasCpf === false ? (
            <Link
              to="/profile"
              className="inline-flex min-h-10 items-center justify-center text-sm font-semibold text-[#0f6b57]"
            >
              Completar CPF no perfil
            </Link>
          ) : null}

          <Link
            to="/b3/revoke-authorization"
            className="inline-flex min-h-9 items-center justify-center text-xs font-medium text-slate-500 underline-offset-4 hover:text-[#0f6b57] hover:underline"
          >
            Saiba como revogar sua autorização
          </Link>

          <Link
            to="/privacy"
            className="inline-flex min-h-9 items-center justify-center text-xs font-medium text-slate-500 underline-offset-4 hover:text-[#0f6b57] hover:underline"
          >
            Como tratamos os dados da B3
          </Link>
        </div>

        {errorMessage ? (
          <div className="mt-3 space-y-1">
            <p role="alert" className="text-xs text-red-600">
              {errorMessage}
            </p>
            {requestId ? (
              <p className="text-[11px] text-slate-500">Código: {requestId}</p>
            ) : null}
          </div>
        ) : null}

        {confirmAuthorization.isSuccess && confirmAuthorization.data.data.possiblyRevoked ? (
          <p className="mt-3 text-xs leading-5 text-amber-800" role="status">
            Não encontramos mais sua autorização na B3. Se você revogou por lá, confirme na página{' '}
            <Link to="/b3/revoke-authorization" className="font-semibold underline underline-offset-2">
              Saiba como revogar
            </Link>{' '}
            para atualizar o status na Pico.
          </p>
        ) : null}

        {confirmAuthorization.isSuccess &&
        !confirmAuthorization.data.data.confirmed &&
        !confirmAuthorization.data.data.possiblyRevoked ? (
          <p className="mt-3 text-xs leading-5 text-slate-600" role="status">
            Ainda não encontramos sua autorização na B3. Se você já concluiu o opt-in, tente de
            novo em breve.
          </p>
        ) : null}
      </div>
    </div>
  )
}
