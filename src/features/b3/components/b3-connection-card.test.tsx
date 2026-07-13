import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { B3ConnectionCard } from '@/features/b3/components/b3-connection-card'
import * as startApi from '@/features/b3/api/start-b3-authorization'
import { B3AuthorizationStartError } from '@/features/b3/types'
import type { StartB3AuthorizationResponse } from '@/features/b3/types'
import {
  isAllowedB3AuthorizationUrl,
  useStartB3Authorization,
} from '@/features/b3/hooks/use-start-b3-authorization'

vi.mock('@/features/auth/hooks/use-auth', () => ({
  useCurrentUser: () => ({
    data: { id: '1', email: 'cliente@pico.test', hasCpf: true },
    isLoading: false,
  }),
}))

vi.mock('@/features/b3/hooks/use-confirm-b3-authorization', () => ({
  useConfirmB3Authorization: () => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
    data: undefined,
  }),
}))

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-router')>(
    '@tanstack/react-router',
  )
  return {
    ...actual,
    Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
  }
})

function renderWithQuery(ui: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('B3ConnectionCard', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('shows privacy link for NOT_CONNECTED', () => {
    renderWithQuery(<B3ConnectionCard />)
    expect(
      screen.getByRole('link', { name: 'Saiba como tratamos os dados da B3' }),
    ).toHaveAttribute('href', '/privacy')
  })

  it('shows refresh status action when AUTHORIZATION_REQUESTED', () => {
    renderWithQuery(<B3ConnectionCard status="AUTHORIZATION_REQUESTED" />)
    expect(screen.getByRole('button', { name: 'Atualizar status' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Continuar na B3' })).toBeEnabled()
  })

  it('shows the connect button for NOT_CONNECTED', () => {
    renderWithQuery(<B3ConnectionCard />)
    expect(screen.getByRole('button', { name: 'Conectar com a B3' })).toBeEnabled()
  })

  it('shows connected state for AUTHORIZED', () => {
    renderWithQuery(<B3ConnectionCard status="AUTHORIZED" />)
    expect(screen.getByText('Carteira B3 conectada')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Conectar com a B3' })).not.toBeInTheDocument()
  })

  it('allows reconnect when REVOKED', () => {
    renderWithQuery(<B3ConnectionCard status="REVOKED" />)
    expect(screen.getByRole('button', { name: 'Reconectar com a B3' })).toBeEnabled()
  })

  it('disables the button while the mutation is pending and redirects on success', async () => {
    const user = userEvent.setup()
    const assignLocation = vi.fn()
    let resolveRequest: ((value: StartB3AuthorizationResponse) => void) | undefined

    vi.spyOn(startApi, 'startB3Authorization').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve
        }),
    )

    function TestHarness() {
      const mutation = useStartB3Authorization({ assignLocation })
      return (
        <button
          type="button"
          disabled={mutation.isPending}
          onClick={() => {
            mutation.mutate()
          }}
        >
          {mutation.isPending ? 'Abrindo ambiente da B3...' : 'Conectar com a B3'}
        </button>
      )
    }

    renderWithQuery(<TestHarness />)

    await user.click(screen.getByRole('button', { name: 'Conectar com a B3' }))
    expect(screen.getByRole('button', { name: 'Abrindo ambiente da B3...' })).toBeDisabled()

    resolveRequest?.({
      data: {
        attemptId: '11111111-1111-4111-8111-111111111111',
        connectionStatus: 'AUTHORIZATION_REQUESTED',
        authorizationUrl: 'https://b3-optin.test.local/authorize',
      },
    })

    await vi.waitFor(() => {
      expect(assignLocation).toHaveBeenCalledWith('https://b3-optin.test.local/authorize')
    })
  })

  it('does not redirect when the authorization url is invalid', async () => {
    const assignLocation = vi.fn()
    vi.spyOn(startApi, 'startB3Authorization').mockResolvedValue({
      data: {
        attemptId: '11111111-1111-4111-8111-111111111111',
        connectionStatus: 'AUTHORIZATION_REQUESTED',
        authorizationUrl: 'http://insecure.example/authorize',
      },
    })

    function TestHarness() {
      const mutation = useStartB3Authorization({ assignLocation })
      return (
        <button
          type="button"
          onClick={() => {
            mutation.mutate()
          }}
        >
          Conectar com a B3
        </button>
      )
    }

    const user = userEvent.setup()
    renderWithQuery(<TestHarness />)

    await user.click(screen.getByRole('button', { name: 'Conectar com a B3' }))

    await vi.waitFor(() => {
      expect(assignLocation).not.toHaveBeenCalled()
      expect(isAllowedB3AuthorizationUrl('http://insecure.example/authorize')).toBe(false)
    })
  })

  it('maps CPF_REQUIRED to a friendly message', async () => {
    vi.spyOn(startApi, 'startB3Authorization').mockRejectedValue(
      new B3AuthorizationStartError(422, 'CPF_REQUIRED', 'CPF required'),
    )

    const user = userEvent.setup()
    renderWithQuery(<B3ConnectionCard />)
    await user.click(screen.getByRole('button', { name: 'Conectar com a B3' }))

    expect(
      await screen.findByText('Complete seu CPF no cadastro antes de conectar com a B3.'),
    ).toBeInTheDocument()
  })

  it('calls the API only once on double click', async () => {
    const user = userEvent.setup()
    let resolveRequest: ((value: StartB3AuthorizationResponse) => void) | undefined

    const startSpy = vi.spyOn(startApi, 'startB3Authorization').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve
        }),
    )

    renderWithQuery(<B3ConnectionCard />)

    const button = screen.getByRole('button', { name: 'Conectar com a B3' })
    await user.dblClick(button)

    expect(startSpy).toHaveBeenCalledTimes(1)

    resolveRequest?.({
      data: {
        attemptId: '11111111-1111-4111-8111-111111111111',
        connectionStatus: 'AUTHORIZATION_REQUESTED',
        authorizationUrl: 'https://b3-optin.test.local/authorize',
      },
    })
  })

  it('keeps AUTHORIZATION_REQUESTED in cache after a successful start', async () => {
    const assignLocation = vi.fn()
    vi.spyOn(startApi, 'startB3Authorization').mockResolvedValue({
      data: {
        attemptId: '11111111-1111-4111-8111-111111111111',
        connectionStatus: 'AUTHORIZATION_REQUESTED',
        authorizationUrl: 'https://b3-optin.test.local/authorize',
      },
    })

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    function TestHarness() {
      const mutation = useStartB3Authorization({ assignLocation })
      return (
        <button
          type="button"
          onClick={() => {
            mutation.mutate()
          }}
        >
          Conectar com a B3
        </button>
      )
    }

    const user = userEvent.setup()
    render(
      <QueryClientProvider client={queryClient}>
        <TestHarness />
      </QueryClientProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Conectar com a B3' }))

    await vi.waitFor(() => {
      expect(assignLocation).toHaveBeenCalled()
      expect(queryClient.getQueryData(['b3', 'connection'])).toMatchObject({
        status: 'AUTHORIZATION_REQUESTED',
      })
    })
  })
})
