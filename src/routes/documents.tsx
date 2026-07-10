import { FileText } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'

import { PlaceholderPage } from '@/features/foundation/placeholder-page'

export const Route = createFileRoute('/documents')({
  component: () => (
    <PlaceholderPage
      eyebrow="Documentos"
      title="Tudo que precisa revisar, assinar ou baixar"
      description="Documentos financeiros serão exibidos com status, vencimento e acesso protegido por URLs temporárias emitidas pela API."
      icon={FileText}
      plannedItems={['Recomendações de investimento e resgate', 'Boletos e documentos fiscais', 'Documentos para assinatura', 'Histórico de downloads']}
    />
  ),
})
