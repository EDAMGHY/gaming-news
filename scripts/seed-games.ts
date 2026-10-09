import 'dotenv/config'

import fetch from 'node-fetch'
import payload from 'payload'

import { isAllowedRawgImageUrl } from '../src/utilities/gameMedia'

const RAWG_API_BASE = 'https://api.rawg.io/api'
const RAWG_API_KEY = process.env.RAWG_API_KEY || ''
const DATE_START = process.env.RAWG_DATE_START || new Date().toISOString().slice(0, 10)
const DATE_END = process.env.RAWG_DATE_END || `${new Date().getUTCFullYear() + 1}-12-31`
const PAGE_SIZE = Math.min(40, Math.max(1, Number(process.env.RAWG_PAGE_SIZE) || 40))
const START_PAGE = Math.max(1, Number(process.env.RAWG_START_PAGE) || 1)
const END_PAGE = process.env.RAWG_END_PAGE
  ? Math.max(START_PAGE, Number(process.env.RAWG_END_PAGE))
  : null
const PUBLISHED = process.env.AUTO_PUBLISH === 'true' ? 'published' : 'draft'
const CLEAN_CATALOGUE = process.env.CLEAN_CATALOGUE !== 'false'
const DRY_RUN = process.env.DRY_RUN === 'true'

interface RAWGGame {
  added?: number
  background_image?: string | null
  developers?: Array<{ name: string }>
  description?: string
  description_raw?: string
  genres: Array<{ name: string }>
  id: number
  name: string
  platforms: Array<{ platform: { name: string } }>
  publishers?: Array<{ name: string }>
  released?: string | null
  short_screenshots?: Array<{ image?: string | null }>
  slug: string
  tags?: Array<{ name: string; slug: string }>
}

interface RAWGListResponse {
  count: number
  next: string | null
  results: RAWGGame[]
}

interface RAWGScreenshotResponse {
  results: Array<{ image?: string | null }>
}

const platformMap: Record<string, string[]> = {
  Android: ['mobile'],
  iOS: ['mobile'],
  'Nintendo Switch': ['switch'],
  'Nintendo Switch 2': ['switch-2'],
  PC: ['pc'],
  'PlayStation 4': ['ps4'],
  'PlayStation 5': ['ps5'],
  'Xbox One': ['xbox-one'],
  'Xbox Series S/X': ['xbox-series'],
}

type PlatformValue =
  | 'mobile'
  | 'pc'
  | 'ps4'
  | 'ps5'
  | 'switch'
  | 'switch-2'
  | 'xbox-one'
  | 'xbox-series'

const EXCLUDED_TITLE_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  {
    label: 'adult/explicit title',
    pattern: /\b(hentai|porn|xxx|milf|erotic|fetish|sex police)\b/i,
  },
  {
    label: 'demo or playtest',
    pattern: /\b(demo|playtest|play test|prototype|technical test|closed beta|open beta)\b/i,
  },
  {
    label: 'bundle or non-game package',
    pattern:
      /\b(bundle|soundtrack|artbook|expansion pass|season pass|starter pack|complete edition)\b/i,
  },
]

const EXCLUDED_TAGS = new Set([
  'adult-only',
  'erotic',
  'hentai',
  'nsfw',
  'nudity',
  'sexual-content',
])

const mapPlatforms = (game: RAWGGame): PlatformValue[] =>
  [
    ...new Set((game.platforms ?? []).flatMap(({ platform }) => platformMap[platform.name] ?? [])),
  ] as PlatformValue[]

const normalizeTitle = (title: string): string =>
  title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')

const catalogueExclusionReason = (game: RAWGGame, platforms: PlatformValue[]): string | null => {
  if (!CLEAN_CATALOGUE) return null

  const titleMatch = EXCLUDED_TITLE_PATTERNS.find(({ pattern }) => pattern.test(game.name))
  if (titleMatch) return titleMatch.label

  const excludedTag = game.tags?.find(
    ({ name, slug }) => EXCLUDED_TAGS.has(slug) || EXCLUDED_TAGS.has(name.toLowerCase()),
  )
  if (excludedTag) return `excluded tag: ${excludedTag.name}`
  if (!isAllowedRawgImageUrl(game.background_image)) return 'missing or invalid RAWG cover'
  if (platforms.length === 0) return 'no supported platform'
  if (!game.genres?.length) return 'missing genre'

  const description = (game.description_raw || game.description || '')
    .replace(/<[^>]*>/g, '')
    .trim()
  if (description.length < 80) return 'description is too incomplete'
  if ((game.added ?? 0) < 3) return 'insufficient RAWG interest'

  return null
}

const fetchJson = async <T>(
  pathname: string,
  parameters: Record<string, string> = {},
): Promise<T> => {
  const query = new URLSearchParams({ key: RAWG_API_KEY, ...parameters })
  const response = await fetch(`${RAWG_API_BASE}${pathname}?${query}`)
  if (!response.ok) {
    throw new Error(`RAWG ${pathname} returned ${response.status}: ${response.statusText}`)
  }
  return (await response.json()) as T
}

const getOrCreateGenres = async (genreNames: string[]) => {
  const genreIds: string[] = []
  for (const name of [...new Set(genreNames.filter(Boolean))]) {
    const existing = await payload.find({
      collection: 'genres',
      limit: 1,
      overrideAccess: true,
      where: { name: { equals: name } },
    })

    if (existing.docs[0]) {
      genreIds.push(String(existing.docs[0].id))
      continue
    }

    const created = await payload.create({
      collection: 'genres',
      data: { name },
      overrideAccess: true,
    })
    genreIds.push(String(created.id))
  }
  return genreIds
}

const getScreenshots = async (game: RAWGGame): Promise<string[]> => {
  let candidates = game.short_screenshots ?? []
  try {
    const response = await fetchJson<RAWGScreenshotResponse>(`/games/${game.id}/screenshots`, {
      page_size: '20',
    })
    if (response.results.length > 0) candidates = response.results
  } catch (error) {
    console.warn(`  Screenshot detail failed for ${game.name}; using list results.`, error)
  }

  return candidates
    .map(({ image }) => image)
    .filter((url): url is string => typeof url === 'string')
    .filter(isAllowedRawgImageUrl)
    .filter((url, index, urls) => urls.indexOf(url) === index)
}

const getGameDetail = async (game: RAWGGame): Promise<RAWGGame> => {
  try {
    return await fetchJson<RAWGGame>(`/games/${game.id}`)
  } catch (error) {
    console.warn(`  Detail request failed for ${game.name}; using list data.`, error)
    return game
  }
}

const seedGames = async () => {
  if (!RAWG_API_KEY) throw new Error('RAWG_API_KEY environment variable is not set.')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(DATE_START) || !/^\d{4}-\d{2}-\d{2}$/.test(DATE_END)) {
    throw new Error('DATE_START and DATE_END must use YYYY-MM-DD.')
  }

  const config = (await import('../src/payload.config')).default
  await payload.init({ config })

  console.log(`Fetching all RAWG releases from ${DATE_START} through ${DATE_END}.`)
  console.log(
    `${CLEAN_CATALOGUE ? 'Clean catalogue filtering is enabled.' : 'Clean filtering is disabled.'}`,
  )
  console.log(
    DRY_RUN
      ? 'Dry run: no Payload records will be changed.'
      : `New records will be ${PUBLISHED}; existing records are updated by RAWG ID.`,
  )

  const syncedGames: Array<{ genres: string[]; id: string; title: string }> = []
  const failures: Array<{ error: string; id: number; title: string }> = []
  const skipped: Array<{ id: number; reason: string; title: string }> = []
  const selectedTitleKeys = new Set<string>()
  let selectedCount = 0
  let createdCount = 0
  let updatedCount = 0
  let expectedCount: number | null = null

  for (let page = START_PAGE; ; page++) {
    if (END_PAGE && page > END_PAGE) break

    const data = await fetchJson<RAWGListResponse>('/games', {
      dates: `${DATE_START},${DATE_END}`,
      ordering: 'released',
      page: String(page),
      page_size: String(PAGE_SIZE),
    })
    expectedCount ??= data.count
    if (data.results.length === 0) break

    console.log(`Page ${page}: ${data.results.length} games (${expectedCount} total results).`)

    for (const listGame of data.results) {
      try {
        const game = await getGameDetail(listGame)
        const platforms = mapPlatforms(game)
        const exclusionReason = catalogueExclusionReason(game, platforms)
        if (exclusionReason) {
          skipped.push({ id: game.id, reason: exclusionReason, title: game.name })
          console.log(`  Skipped: ${game.name} (${exclusionReason})`)
          continue
        }

        const titleKey = normalizeTitle(game.name)
        if (selectedTitleKeys.has(titleKey)) {
          skipped.push({ id: game.id, reason: 'duplicate normalized title', title: game.name })
          console.log(`  Skipped: ${game.name} (duplicate normalized title)`)
          continue
        }
        selectedTitleKeys.add(titleKey)

        selectedCount++
        if (DRY_RUN) {
          console.log(`  Selected: ${game.name}`)
          continue
        }

        const genreIds = await getOrCreateGenres((game.genres ?? []).map(({ name }) => name))
        const screenshots = await getScreenshots(game)
        const externalCoverUrl = isAllowedRawgImageUrl(game.background_image)
          ? game.background_image
          : undefined
        const synopsisSource = game.description_raw || game.description || ''
        const synopsis =
          synopsisSource
            .replace(/<[^>]*>/g, '')
            .trim()
            .slice(0, 1000) ||
          `${game.name} is scheduled for release on ${game.released || 'an unannounced date'}.`
        const developer = game.developers
          ?.map(({ name }) => name)
          .filter(Boolean)
          .join(', ')
        const publisher = game.publishers
          ?.map(({ name }) => name)
          .filter(Boolean)
          .join(', ')

        const existing = await payload.find({
          collection: 'games',
          limit: 1,
          overrideAccess: true,
          where: { rawgId: { equals: game.id } },
        })
        const dataToSave = {
          _status: PUBLISHED,
          developer,
          externalCoverUrl,
          externalScreenshots: screenshots.map((url) => ({ url })),
          genres: genreIds,
          meta: { description: synopsis.slice(0, 160), title: game.name },
          platforms,
          publisher,
          rawgId: game.id,
          rawgSlug: game.slug,
          releaseDate: game.released || undefined,
          slug: game.slug,
          slugLock: true,
          synopsis,
          title: game.name,
        } as const

        const saved = existing.docs[0]
          ? await payload.update({
              collection: 'games',
              data: dataToSave,
              id: existing.docs[0].id,
              overrideAccess: true,
            })
          : await payload.create({
              collection: 'games',
              data: dataToSave,
              overrideAccess: true,
            })

        if (existing.docs[0]) updatedCount++
        else createdCount++
        syncedGames.push({ genres: genreIds, id: String(saved.id), title: saved.title })
        console.log(`  ${existing.docs[0] ? 'Updated' : 'Created'}: ${game.name}`)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        failures.push({ error: message, id: listGame.id, title: listGame.name })
        console.error(`  Failed: ${listGame.name}: ${message}`)
      }
    }

    if (!data.next || data.results.length < PAGE_SIZE) break
  }

  if (!DRY_RUN) {
    console.log('Linking related games by shared genre.')
    for (const game of syncedGames) {
      const relatedGames = syncedGames
        .filter(
          (candidate) =>
            candidate.id !== game.id &&
            candidate.genres.some((genreId) => game.genres.includes(genreId)),
        )
        .slice(0, 3)
        .map(({ id }) => id)

      await payload.update({
        collection: 'games',
        data: { relatedGames },
        id: game.id,
        overrideAccess: true,
      })
    }
  }

  console.log(
    `${DRY_RUN ? 'Preview' : 'Sync'} complete: ${selectedCount} selected, ${skipped.length} skipped, ${createdCount} created, ${updatedCount} updated, ${failures.length} failed.`,
  )
  if (failures.length > 0) {
    console.error(JSON.stringify(failures, null, 2))
  }
  process.exit(failures.length > 0 ? 1 : 0)
}

seedGames().catch((error) => {
  console.error(error)
  process.exit(1)
})
