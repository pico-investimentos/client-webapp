import { createFileRoute } from '@tanstack/react-router'

import { ClientDashboard } from '@/features/dashboard/client-dashboard'
import { requireSession } from '@/features/auth/require-session'

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    await requireSession(context.queryClient)
  },
  component: ClientDashboard,
})
