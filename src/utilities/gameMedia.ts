import type { Game, Media } from '@/payload-types'

export const RAWG_IMAGE_HOST = 'media.rawg.io'

export const isAllowedRawgImageUrl = (value: unknown): value is string => {
  if (typeof value !== 'string' || value.length === 0) return false

  try {
    const url = new URL(value)

    return (
      url.protocol === 'https:' &&
      url.hostname === RAWG_IMAGE_HOST &&
      url.port === '' &&
      url.pathname.startsWith('/media/') &&
      url.search === '' &&
      url.hash === ''
    )
  } catch {
    return false
  }
}

type GameMediaFields = Pick<
  Game,
  'coverImage' | 'externalCoverUrl' | 'externalScreenshots' | 'screenshots'
>

export type GameImageSource = Media | string

const isPopulatedMedia = (value: unknown): value is Media =>
  typeof value === 'object' && value !== null && 'id' in value

export const getGameCover = (game: Partial<GameMediaFields>): GameImageSource | undefined => {
  if (isPopulatedMedia(game.coverImage)) return game.coverImage
  if (isAllowedRawgImageUrl(game.externalCoverUrl)) return game.externalCoverUrl

  return undefined
}

export const getGameScreenshots = (game: Partial<GameMediaFields>): GameImageSource[] => {
  const screenshots: GameImageSource[] = []
  const seen = new Set<string>()

  for (const item of game.screenshots ?? []) {
    if (!isPopulatedMedia(item)) continue

    const key = item.url || String(item.id)
    if (seen.has(key)) continue
    seen.add(key)
    screenshots.push(item)
  }

  for (const item of game.externalScreenshots ?? []) {
    if (!isAllowedRawgImageUrl(item?.url) || seen.has(item.url)) continue
    seen.add(item.url)
    screenshots.push(item.url)
  }

  return screenshots
}

export const validateRawgImageUrl = (value: string | null | undefined): string | true =>
  !value || isAllowedRawgImageUrl(value)
    ? true
    : 'Use an HTTPS image URL from media.rawg.io/media/.'
