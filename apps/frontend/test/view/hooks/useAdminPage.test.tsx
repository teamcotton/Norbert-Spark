import { describe, expect, it } from 'vitest'

import { useAdminPage } from '../../../src/view/hooks/useAdminPage.js'

describe('useAdminPage', () => {
  it('should be defined', () => {
    expect(useAdminPage).toBeDefined()
  })
})
