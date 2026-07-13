import { createFileRoute } from '@tanstack/react-router'

import { B3RevokeAuthorizationPage } from '@/features/b3/pages/b3-revoke-authorization-page'

export const Route = createFileRoute('/b3/revoke-authorization')({
  component: B3RevokeAuthorizationPage,
})
