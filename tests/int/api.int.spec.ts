import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('API', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })

  it.each(['articles', 'reviews', 'games'] as const)('queries published %s', async (collection) => {
    const result = await payload.find({
      collection,
      limit: 1,
      overrideAccess: false,
    })

    expect(result.docs).toBeInstanceOf(Array)
    expect(result.totalDocs).toBeGreaterThanOrEqual(0)
  })
})
