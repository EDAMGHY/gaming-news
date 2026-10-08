import type { PayloadRequest } from 'payload'

import { canRunJobs } from '@/utilities/canRunJobs'
import { afterEach, describe, expect, it, vi } from 'vitest'

function request(authorization?: string, user?: PayloadRequest['user']): PayloadRequest {
  return {
    headers: new Headers(authorization ? { authorization } : undefined),
    user,
  } as PayloadRequest
}

describe('canRunJobs', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it.each([undefined, '', '   '])(
    'denies unauthenticated access when CRON_SECRET is %s',
    (cronSecret) => {
      vi.stubEnv('CRON_SECRET', cronSecret)

      expect(canRunJobs({ req: request('Bearer undefined') })).toBe(false)
      expect(canRunJobs({ req: request() })).toBe(false)
    },
  )

  it('accepts only the configured bearer secret for unauthenticated requests', () => {
    vi.stubEnv('CRON_SECRET', 'configured-secret')

    expect(canRunJobs({ req: request('Bearer configured-secret') })).toBe(true)
    expect(canRunJobs({ req: request('Bearer wrong-secret') })).toBe(false)
  })

  it('allows authenticated Payload users without a cron secret', () => {
    vi.stubEnv('CRON_SECRET', undefined)

    expect(
      canRunJobs({ req: request(undefined, { id: 'user-id' } as PayloadRequest['user']) }),
    ).toBe(true)
  })
})
