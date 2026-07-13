import { useId, useState, type FormEvent } from 'react'
import { Button, useOverlayState } from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'

import { mapB3RevocationError } from '@/features/b3/api/revoke-b3-authorization'
import { useRevokeB3Authorization } from '@/features/b3/hooks/use-revoke-b3-authorization'
import { AppModal, Modal } from '@/shared/ui/app-modal'

type B3RevokeAuthorizationModalProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export function B3RevokeAuthorizationModal({
  isOpen,
  onOpenChange,
}: B3RevokeAuthorizationModalProps) {
  const navigate = useNavigate()
  const revokeAuthorization = useRevokeB3Authorization()
  const [password, setPassword] = useState('')
  const passwordId = useId()
  const state = useOverlayState({
    isOpen,
    onOpenChange: (nextOpen) => {
      if (!nextOpen) {
        setPassword('')
        revokeAuthorization.reset()
      }
      onOpenChange(nextOpen)
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (revokeAuthorization.isPending || password.length < 8) {
      return
    }

    revokeAuthorization.mutate(password, {
      onSuccess: () => {
        setPassword('')
        state.close()
        void navigate({ to: '/' })
      },
    })
  }

  const errorMessage = revokeAuthorization.isError
    ? mapB3RevocationError(revokeAuthorization.error)
    : null

  return (
    <AppModal state={state} isDismissable={!revokeAuthorization.isPending}>
      <Modal.Dialog className="rounded-2xl bg-white p-0 shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
        <form onSubmit={handleSubmit}>
          <Modal.Header className="flex flex-col gap-1 border-b border-slate-100 px-6 py-5">
            <Modal.Heading className="text-lg font-semibold tracking-[-0.03em] text-slate-950">
              Confirmar revogação
            </Modal.Heading>
            <p className="text-sm leading-6 text-slate-600">
              Isso remove a autorização da Pico na B3. Para continuar, digite a senha da sua conta
              Pico (não a senha da B3).
            </p>
          </Modal.Header>

          <Modal.Body className="space-y-4 px-6 py-5">
            <label className="block space-y-2" htmlFor={passwordId}>
              <span className="text-sm font-medium text-slate-700">Senha da Pico</span>
              <input
                id={passwordId}
                type="password"
                autoComplete="current-password"
                required
                minLength={8}
                value={password}
                disabled={revokeAuthorization.isPending}
                onChange={(event) => setPassword(event.target.value)}
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-[#0f6b57] focus:ring-2"
              />
            </label>

            {errorMessage ? (
              <p role="alert" className="text-sm text-red-600">
                {errorMessage}
              </p>
            ) : null}
          </Modal.Body>

          <Modal.Footer className="flex flex-col-reverse gap-2 border-t border-slate-100 px-6 py-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              className="min-h-10 rounded-xl"
              isDisabled={revokeAuthorization.isPending}
              onPress={state.close}
            >
              Manter autorização
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="min-h-10 rounded-xl bg-red-700 text-white"
              isDisabled={revokeAuthorization.isPending || password.length < 8}
              aria-busy={revokeAuthorization.isPending}
            >
              {revokeAuthorization.isPending ? 'Revogando...' : 'Revogar autorização'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Dialog>
    </AppModal>
  )
}
