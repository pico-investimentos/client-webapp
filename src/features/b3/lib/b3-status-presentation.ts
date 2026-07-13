import type { LucideIcon } from 'lucide-react'
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Clock3,
  Unplug,
} from 'lucide-react'

import type { B3ConnectionStatus } from '@/features/b3/types'

export type B3StatusPresentation = {
  label: string
  shortLabel: string
  description: string
  toneClass: string
  iconClass: string
  Icon: LucideIcon
  showBanner: boolean
}

const presentations: Record<B3ConnectionStatus, B3StatusPresentation> = {
  NOT_CONNECTED: {
    label: 'B3 não conectada',
    shortLabel: 'Desconectado',
    description: 'Autorize o compartilhamento dos seus dados na B3 para sincronizar a carteira.',
    toneClass: 'bg-slate-500',
    iconClass: 'text-slate-600',
    Icon: Unplug,
    showBanner: true,
  },
  AUTHORIZATION_REQUESTED: {
    label: 'Autorização pendente',
    shortLabel: 'Pendente',
    description: 'Você já iniciou o opt-in. Atualize o status após concluir na B3.',
    toneClass: 'bg-amber-500',
    iconClass: 'text-amber-700',
    Icon: Clock3,
    showBanner: true,
  },
  AUTHORIZED: {
    label: 'B3 conectada',
    shortLabel: 'Conectado',
    description: 'Tudo certo. Sua autorização com a B3 está ativa.',
    toneClass: 'bg-emerald-500',
    iconClass: 'text-emerald-700',
    Icon: CheckCircle2,
    showBanner: false,
  },
  REVOKED: {
    label: 'Autorização revogada',
    shortLabel: 'Revogada',
    description: 'A autorização foi revogada. Reconecte quando quiser retomar o compartilhamento.',
    toneClass: 'bg-orange-500',
    iconClass: 'text-orange-700',
    Icon: Ban,
    showBanner: true,
  },
  ERROR: {
    label: 'Problema na conexão',
    shortLabel: 'Erro',
    description: 'Houve um problema na conexão com a B3. Tente atualizar ou reconectar.',
    toneClass: 'bg-red-500',
    iconClass: 'text-red-700',
    Icon: AlertTriangle,
    showBanner: true,
  },
}

export function getB3StatusPresentation(
  status: B3ConnectionStatus | null | undefined,
): B3StatusPresentation {
  return presentations[status ?? 'NOT_CONNECTED']
}
