import { HandHelping } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'

import { requireSession } from '@/features/auth/require-session'
import { PlaceholderPage } from '@/features/foundation/placeholder-page'

export const Route = createFileRoute('/services')({
  beforeLoad: async ({ context }) => {
    await requireSession(context.queryClient)
  },
  component: () => (
    <PlaceholderPage
      eyebrow="Serviços"
      title="Solicitações acompanhadas do início ao fim"
      description="O cliente poderá abrir pedidos adicionais, anexar informações e acompanhar o responsável e o andamento de cada solicitação."
      icon={HandHelping}
      plannedItems={['Catálogo de serviços', 'Abertura segura de solicitações', 'Linha do tempo de atendimento', 'Mensagens com o assessor']}
    />
  ),
})
