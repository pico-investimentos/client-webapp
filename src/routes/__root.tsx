import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

import { B3AutoConfirm } from '@/features/b3/components/b3-auto-confirm'
import { B3ConnectionBanner } from '@/features/b3/components/b3-connection-banner'
import { B3HeaderStatus } from '@/features/b3/components/b3-header-status'
import { AppShell } from '@/shared/components/app-shell'
import { AppErrorPage, NotFoundPage } from '@/shared/components/route-state'

type RouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <AppShell headerAccessory={<B3HeaderStatus />} banner={<B3ConnectionBanner />}>
      <B3AutoConfirm />
      <Outlet />
    </AppShell>
  ),
  notFoundComponent: NotFoundPage,
  errorComponent: ({ error }) => <AppErrorPage message={error.message} />,
})
