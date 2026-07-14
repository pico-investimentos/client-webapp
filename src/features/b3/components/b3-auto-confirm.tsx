import { useAutoConfirmB3Authorization } from '@/features/b3/hooks/use-auto-confirm-b3-authorization'

/** Mount-only bridge for T2 auto-confirmação (login + foco da aba). */
export function B3AutoConfirm() {
  useAutoConfirmB3Authorization()
  return null
}
