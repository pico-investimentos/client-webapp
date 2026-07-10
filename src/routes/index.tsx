import { createFileRoute } from '@tanstack/react-router'

import { ClientDashboard } from '@/features/dashboard/client-dashboard'

export const Route = createFileRoute('/')({
  component: ClientDashboard,
})
