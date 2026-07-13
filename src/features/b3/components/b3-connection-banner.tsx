import { Link } from '@tanstack/react-router'
import { Button } from '@heroui/react'

import { useCurrentUser } from '@/features/auth/hooks/use-auth'
import { useB3Connection } from '@/features/b3/hooks/use-b3-connection'
import { useStartB3Authorization } from '@/features/b3/hooks/use-start-b3-authorization'
import { getB3StatusPresentation } from '@/features/b3/lib/b3-status-presentation'

export function B3ConnectionBanner() {
  const currentUser = useCurrentUser()
  const enabled = Boolean(currentUser.data)
  const connection = useB3Connection(enabled)
  const startAuthorization = useStartB3Authorization()

  if (!enabled) {
    return null
  }

  const status = connection.data?.status ?? 'NOT_CONNECTED'
  const presentation = getB3StatusPresentation(status)

  if (!presentation.showBanner) {
    return null
  }

  const missingCpf = currentUser.data?.hasCpf === false
  const StatusIcon = presentation.Icon

  return (
    <div className="border-b border-amber-900/8 bg-[#fff8eb]" role="region" aria-label="Aviso de conexão B3">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-start gap-3">
          <span className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-white ${presentation.iconClass}`}>
            <StatusIcon size={16} strokeWidth={2} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">{presentation.label}</p>
            <p className="mt-0.5 text-pretty text-xs leading-5 text-slate-600 sm:text-sm">
              {status === 'NOT_CONNECTED'
                ? 'Para consultar sua carteira com dados da B3, autorize o compartilhamento no ambiente oficial. A Pico não recebe sua senha da B3.'
                : presentation.description}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          {missingCpf ? (
            <Link
              to="/profile"
              className="inline-flex min-h-10 items-center rounded-xl px-3 text-sm font-semibold text-[#0f6b57]"
            >
              Completar CPF
            </Link>
          ) : (
            <Button
              type="button"
              variant="primary"
              className="min-h-10 rounded-xl bg-[#0f6b57] text-white"
              isDisabled={startAuthorization.isPending}
              aria-busy={startAuthorization.isPending}
              onPress={() => {
                startAuthorization.mutate()
              }}
            >
              {startAuthorization.isPending
                ? 'Abrindo B3...'
                : status === 'AUTHORIZATION_REQUESTED'
                  ? 'Continuar na B3'
                  : status === 'REVOKED' || status === 'ERROR'
                    ? 'Reconectar'
                    : 'Autorizar B3'}
            </Button>
          )}
          <Link
            to="/privacy"
            className="inline-flex min-h-10 items-center px-2 text-sm font-medium text-slate-600 underline-offset-4 hover:underline"
          >
            Saiba mais
          </Link>
        </div>
      </div>
    </div>
  )
}
