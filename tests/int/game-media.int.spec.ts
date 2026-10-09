import { describe, expect, it } from 'vitest'
import type { Media } from '@/payload-types'

import {
  getGameCover,
  getGameScreenshots,
  isAllowedRawgImageUrl,
  validateRawgImageUrl,
} from '@/utilities/gameMedia'

const cover = 'https://media.rawg.io/media/games/example/cover.jpg'
const screenshot = 'https://media.rawg.io/media/screenshots/example/shot.jpg'

describe('RAWG game media', () => {
  it('accepts only strict RAWG media URLs', () => {
    expect(isAllowedRawgImageUrl(cover)).toBe(true)
    expect(isAllowedRawgImageUrl('http://media.rawg.io/media/games/example.jpg')).toBe(false)
    expect(isAllowedRawgImageUrl('https://images.rawg.io/media/games/example.jpg')).toBe(false)
    expect(isAllowedRawgImageUrl(`${cover}?width=300`)).toBe(false)
    expect(isAllowedRawgImageUrl('https://media.rawg.io/not-media/example.jpg')).toBe(false)
    expect(validateRawgImageUrl('https://example.com/cover.jpg')).toBeTypeOf('string')
  })

  it('prefers a populated local cover over the external cover', () => {
    const local = { id: 'media-1', url: '/api/media/file/local.jpg' }
    expect(getGameCover({ coverImage: local as Media, externalCoverUrl: cover })).toBe(local)
  })

  it('uses a valid external cover when no local override is populated', () => {
    expect(getGameCover({ coverImage: null, externalCoverUrl: cover })).toBe(cover)
    expect(
      getGameCover({ coverImage: null, externalCoverUrl: 'https://example.com/cover.jpg' }),
    ).toBeUndefined()
  })

  it('merges local and external screenshots and removes duplicate URLs', () => {
    const local = { id: 'media-2', url: screenshot }
    const result = getGameScreenshots({
      externalScreenshots: [
        { id: 'row-1', url: screenshot },
        { id: 'row-2', url: cover },
        { id: 'row-3', url: 'https://example.com/rejected.jpg' },
      ],
      screenshots: [local as Media],
    })

    expect(result).toEqual([local, cover])
  })
})
