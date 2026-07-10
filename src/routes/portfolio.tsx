import { WalletCards } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'

import { PlaceholderPage } from '@/features/foundation/placeholder-page'

export const Route = createFileRoute('/portfolio')({
  component: () => (
    <PlaceholderPage
      eyebrow="Carteira"
      title="Seus investimentos em uma visão clara"
      description="Esta área reunirá posições, movimentações, rentabilidade e detalhes de cada ativo com dados fornecidos pela API."
      icon={WalletCards}
      plannedItems={['Posição consolidada por classe', 'Detalhes e histórico dos ativos', 'Rentabilidade por período', 'Movimentações recentes']}
    />
  ),
})
