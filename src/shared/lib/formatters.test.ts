import { describe, expect, it } from 'vitest'

import { formatCurrency, formatPercent } from '@/shared/lib/formatters'

describe('formatters', () => {
  it('formata valores em real brasileiro', () => {
    expect(formatCurrency(486240.7)).toMatch(/R\$\s486\.240,70/)
  })

  it('formata percentuais a partir de uma razão', () => {
    expect(formatPercent(0.024)).toBe('2,4%')
  })
})
