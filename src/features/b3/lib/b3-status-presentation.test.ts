import { describe, expect, it } from 'vitest'

import { getB3StatusPresentation } from '@/features/b3/lib/b3-status-presentation'

describe('getB3StatusPresentation', () => {
  it('shows a banner for disconnected states', () => {
    expect(getB3StatusPresentation('NOT_CONNECTED').showBanner).toBe(true)
    expect(getB3StatusPresentation('AUTHORIZATION_REQUESTED').showBanner).toBe(true)
    expect(getB3StatusPresentation('REVOKED').showBanner).toBe(true)
    expect(getB3StatusPresentation('ERROR').showBanner).toBe(true)
  })

  it('hides the banner and marks success when authorized', () => {
    const presentation = getB3StatusPresentation('AUTHORIZED')
    expect(presentation.showBanner).toBe(false)
    expect(presentation.label).toContain('conectada')
  })
})
