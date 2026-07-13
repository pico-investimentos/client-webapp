import { CircleUserRound } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'

import { requireSession } from '@/features/auth/require-session'
import { PlaceholderPage } from '@/features/foundation/placeholder-page'

export const Route = createFileRoute('/profile')({
  beforeLoad: async ({ context }) => {
    await requireSession(context.queryClient)
  },
  component: () => (
    <PlaceholderPage
      eyebrow="Perfil"
      title="Dados pessoais e perfil de investidor"
      description="Esta área concentrará dados cadastrais, preferências e o questionário de suitability com histórico e validade controlados pela API."
      icon={CircleUserRound}
      plannedItems={['Dados pessoais e de contato', 'Perfil de investidor atual', 'Atualização do questionário', 'Preferências de comunicação']}
    />
  ),
})
