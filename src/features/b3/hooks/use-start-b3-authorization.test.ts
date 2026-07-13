import { describe, expect, it } from 'vitest'

import {
  isAllowedB3AuthorizationUrl,
  mapB3AuthorizationError,
} from '@/features/b3/hooks/use-start-b3-authorization'
import { B3AuthorizationStartError } from '@/features/b3/types'

describe('B3 authorization helpers', () => {
  it('accepts only https urls', () => {
    expect(isAllowedB3AuthorizationUrl('https://b3.example/optin')).toBe(true)
    expect(isAllowedB3AuthorizationUrl('http://b3.example/optin')).toBe(false)
    expect(isAllowedB3AuthorizationUrl('not-a-url')).toBe(false)
  })

  it('maps known error codes', () => {
    expect(
      mapB3AuthorizationError(new B3AuthorizationStartError(422, 'CPF_REQUIRED', 'x')),
    ).toContain('CPF')
    expect(
      mapB3AuthorizationError(new B3AuthorizationStartError(429, 'TOO_MANY_ATTEMPTS', 'x')),
    ).toContain('Muitas tentativas')
    expect(
      mapB3AuthorizationError(new B3AuthorizationStartError(403, 'USER_NOT_ELIGIBLE', 'x')),
    ).toContain('elegível')
    expect(
      mapB3AuthorizationError(new B3AuthorizationStartError(500, 'SOMETHING_WEIRD', 'x')),
    ).toContain('Não foi possível iniciar a conexão')
    expect(mapB3AuthorizationError(new Error('boom'))).toContain(
      'Não foi possível iniciar a conexão',
    )
  })
})
