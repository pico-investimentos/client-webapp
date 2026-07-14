import { useEffect, useEffectEvent, useRef } from 'react'

import { useCurrentUser } from '@/features/auth/hooks/use-auth'
import { useB3Connection } from '@/features/b3/hooks/use-b3-connection'
import { useConfirmB3Authorization } from '@/features/b3/hooks/use-confirm-b3-authorization'
import type { B3ConnectionStatus } from '@/features/b3/types'

const CONFIRM_COOLDOWN_MS = 60_000
const LAST_CONFIRM_AT_KEY = 'pico.b3.confirm.lastAt'

const AUTO_CONFIRM_STATUSES = new Set<B3ConnectionStatus>([
  'AUTHORIZATION_REQUESTED',
  'AUTHORIZED',
])

function readLastConfirmAt(): number {
  try {
    return Number(sessionStorage.getItem(LAST_CONFIRM_AT_KEY) ?? 0)
  } catch {
    return 0
  }
}

function writeLastConfirmAt(timestamp: number): void {
  try {
    sessionStorage.setItem(LAST_CONFIRM_AT_KEY, String(timestamp))
  } catch {
    // ignore quota / private mode
  }
}

/**
 * T2: dispara confirmação B3 no login e ao ganhar foco da aba,
 * com cooldown de 60s e só para status elegíveis.
 */
export function useAutoConfirmB3Authorization() {
  const currentUser = useCurrentUser()
  const enabled = Boolean(currentUser.data)
  const connection = useB3Connection(enabled)
  const confirmAuthorization = useConfirmB3Authorization()
  const seenUserIdRef = useRef<string | null>(null)

  const tryAutoConfirm = useEffectEvent((reason: 'login' | 'focus') => {
    if (!currentUser.data || confirmAuthorization.isPending) {
      return
    }

    const status = connection.data?.status
    if (!status || !AUTO_CONFIRM_STATUSES.has(status)) {
      return
    }

    const now = Date.now()
    if (now - readLastConfirmAt() < CONFIRM_COOLDOWN_MS) {
      return
    }

    writeLastConfirmAt(now)
    confirmAuthorization.mutate(undefined, {
      onError: () => {
        // Auto-confirm is best-effort; manual refresh remains available.
        if (reason === 'focus') {
          writeLastConfirmAt(now)
        }
      },
    })
  })

  useEffect(() => {
    const userId = currentUser.data?.id ?? null

    if (!userId) {
      seenUserIdRef.current = null
      return
    }

    if (connection.isLoading || connection.data == null) {
      return
    }

    if (seenUserIdRef.current === userId) {
      return
    }

    seenUserIdRef.current = userId
    tryAutoConfirm('login')
  }, [currentUser.data?.id, connection.data, connection.isLoading, tryAutoConfirm])

  useEffect(() => {
    if (!enabled) {
      return
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        tryAutoConfirm('focus')
      }
    }

    const handleFocus = () => {
      tryAutoConfirm('focus')
    }

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('focus', handleFocus)
    }
  }, [enabled, tryAutoConfirm])
}
