import 'dotenv/config'

/* eslint-disable @typescript-eslint/no-explicit-any -- migration boundaries read legacy Mongo shapes */

import { execFile } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import fetch from 'node-fetch'
import payload from 'payload'

import { isAllowedRawgImageUrl } from '../src/utilities/gameMedia'

const RAWG_API_BASE = 'https://api.rawg.io/api'
const RAWG_API_KEY = process.env.RAWG_API_KEY || ''
const REPORT_DIR = path.resolve('migration-reports')
const MEDIA_DIR = path.resolve('public/media')
const runFile = promisify(execFile)

type RelationValue = string | { id?: string | number } | null | undefined

type RawgGame = {
  background_image?: string | null
  id: number
  name: string
  released?: string | null
  short_screenshots?: Array<{ image?: string | null }>
  slug: string
}

type MediaSnapshot = {
  filenames: string[]
  id: string
  keepFilenames: string[]
}

type ManifestEntry = {
  externalCoverUrl: string
  externalScreenshotUrls: string[]
  gameId: string
  media: MediaSnapshot[]
  previousCoverImage: string | null
  previousMetaImage: string | null
  previousScreenshots: string[]
  rawgId: number
  rawgSlug: string
  status: 'migrated' | 'pending' | 'rolledBack'
  title: string
}

type MigrationManifest = {
  cleanup?: {
    archivePath: string | null
    completedAt?: string
    deletedMediaIds: string[]
    prunedMediaIds: string[]
    retainedReferencedIds: string[]
  }
  createdAt: string
  entries: ManifestEntry[]
  unresolved: Array<{ gameId: string; reason: string; title: string }>
  version: 1
}

const args = process.argv.slice(2)
const APPLY = args.includes('--apply')
const CLEANUP = args.includes('--cleanup')
const ROLLBACK = args.includes('--rollback')
const option = (name: string) =>
  args.find((arg) => arg.startsWith(`${name}=`))?.slice(name.length + 1)
const MANIFEST_PATH = option('--manifest') || option('--resume')
const LIMIT = Number(option('--limit') || 0)

const pause = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds))

const toId = (value: RelationValue): string | null => {
  if (!value) return null
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value.id !== undefined) return String(value.id)
  return null
}

const normalizeTitle = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

const dateOnly = (value: unknown): string | null => {
  if (typeof value !== 'string' || !value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10)
}

const atomicWriteManifest = async (manifestPath: string, manifest: MigrationManifest) => {
  const temporaryPath = `${manifestPath}.tmp`
  await fs.writeFile(temporaryPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  await fs.rename(temporaryPath, manifestPath)
}

const readManifest = async (): Promise<{ manifest: MigrationManifest; manifestPath: string }> => {
  if (!MANIFEST_PATH) {
    throw new Error('Provide --manifest=path/to/manifest.json for cleanup or rollback.')
  }

  const manifestPath = path.resolve(MANIFEST_PATH)
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8')) as MigrationManifest
  if (manifest.version !== 1) throw new Error(`Unsupported manifest version: ${manifest.version}`)

  return { manifest, manifestPath }
}

const getAllDocs = async (collection: string, draft = false): Promise<Record<string, any>[]> => {
  const docs: Record<string, any>[] = []

  for (let page = 1; ; page++) {
    const result = await payload.find({
      collection: collection as any,
      depth: 0,
      draft,
      limit: 500,
      overrideAccess: true,
      page,
    })
    docs.push(...(result.docs as Record<string, any>[]))
    if (!result.hasNextPage) break
  }

  return docs
}

const fetchRawgMatch = async (game: Record<string, any>): Promise<RawgGame | null> => {
  const query = new URLSearchParams({
    key: RAWG_API_KEY,
    page_size: '10',
    search: game.title,
    search_exact: 'true',
  })
  const response = await fetch(`${RAWG_API_BASE}/games?${query}`)
  if (!response.ok) throw new Error(`RAWG returned ${response.status} for "${game.title}"`)

  const data = (await response.json()) as { results?: RawgGame[] }
  const candidates = data.results ?? []

  if (typeof game.rawgId === 'number') {
    const byId = candidates.find((candidate) => candidate.id === game.rawgId)
    if (byId) return byId
  }

  const normalizedTitle = normalizeTitle(game.title)
  const exactTitle = candidates.filter(
    (candidate) => normalizeTitle(candidate.name) === normalizedTitle,
  )
  const releaseDate = dateOnly(game.releaseDate)
  const exactDate = releaseDate
    ? exactTitle.filter((candidate) => dateOnly(candidate.released) === releaseDate)
    : []

  if (exactDate.length === 1) return exactDate[0]
  if (exactTitle.length === 1) return exactTitle[0]

  return null
}

const loadRawMedia = async (): Promise<Map<string, MediaSnapshot>> => {
  const model = payload.db.collections.media as any
  const rawDocs = (await model.collection.find({}).toArray()) as Array<Record<string, any>>
  const media = new Map<string, MediaSnapshot>()

  for (const doc of rawDocs) {
    const filenames = new Set<string>()
    const keepFilenames = new Set<string>()
    if (typeof doc.filename === 'string') {
      filenames.add(doc.filename)
      keepFilenames.add(doc.filename)
    }

    for (const [name, size] of Object.entries(doc.sizes ?? {}) as Array<
      [string, Record<string, unknown>]
    >) {
      if (typeof size?.filename === 'string') filenames.add(size.filename)
      if (name === 'thumbnail' && typeof size?.filename === 'string') {
        keepFilenames.add(size.filename)
      }
    }

    media.set(String(doc._id), {
      id: String(doc._id),
      filenames: [...filenames],
      keepFilenames: [...keepFilenames],
    })
  }

  return media
}

const migrate = async () => {
  if (!RAWG_API_KEY) throw new Error('RAWG_API_KEY is required for migration.')

  const allGames = await getAllDocs('games', true)
  const games = LIMIT > 0 ? allGames.slice(0, LIMIT) : allGames
  const rawMedia = await loadRawMedia()
  let manifest: MigrationManifest
  let manifestPath: string | null = null

  if (MANIFEST_PATH) {
    manifestPath = path.resolve(MANIFEST_PATH)
    manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8')) as MigrationManifest
  } else {
    manifest = { createdAt: new Date().toISOString(), entries: [], unresolved: [], version: 1 }
    if (APPLY) {
      await fs.mkdir(REPORT_DIR, { recursive: true })
      manifestPath = path.join(REPORT_DIR, `rawg-media-${Date.now()}.json`)
      await atomicWriteManifest(manifestPath, manifest)
      console.log(`Rollback manifest: ${manifestPath}`)
    }
  }

  const completedIds = new Set(
    manifest.entries.filter((entry) => entry.status === 'migrated').map((entry) => entry.gameId),
  )
  let matched = 0
  let unresolved = 0

  for (const game of games) {
    const gameId = String(game.id)
    if (completedIds.has(gameId)) continue

    const pendingIndex = manifest.entries.findIndex(
      (entry) => entry.gameId === gameId && entry.status === 'pending',
    )
    const pendingEntry = pendingIndex >= 0 ? manifest.entries[pendingIndex] : null

    if (
      pendingEntry &&
      !toId(game.coverImage) &&
      (!Array.isArray(game.screenshots) || game.screenshots.length === 0) &&
      game.externalCoverUrl === pendingEntry.externalCoverUrl
    ) {
      pendingEntry.status = 'migrated'
      if (APPLY && manifestPath) await atomicWriteManifest(manifestPath, manifest)
      console.log(`  ✓ Recovered completed entry: ${game.title}`)
      continue
    }

    if (pendingIndex >= 0) manifest.entries.splice(pendingIndex, 1)

    if (
      !toId(game.coverImage) &&
      (!Array.isArray(game.screenshots) || game.screenshots.length === 0) &&
      isAllowedRawgImageUrl(game.externalCoverUrl)
    ) {
      console.log(`  ⏭️  Already external: ${game.title}`)
      continue
    }

    let rawg: RawgGame | null = null
    let reason = 'No unambiguous RAWG title/release-date match.'
    try {
      rawg = await fetchRawgMatch(game)
    } catch (error) {
      reason = error instanceof Error ? error.message : String(error)
    }

    if (!rawg || !isAllowedRawgImageUrl(rawg.background_image)) {
      unresolved++
      const existing = manifest.unresolved.find((item) => item.gameId === gameId)
      if (!existing) manifest.unresolved.push({ gameId, reason, title: game.title })
      console.log(`  ⚠️  ${game.title}: ${reason}`)
      if (APPLY && manifestPath) await atomicWriteManifest(manifestPath, manifest)
      await pause(75)
      continue
    }

    const previousCoverImage = toId(game.coverImage)
    const previousScreenshots = Array.isArray(game.screenshots)
      ? game.screenshots.map(toId).filter((id): id is string => Boolean(id))
      : []
    const previousMetaImage = toId(game.meta?.image)
    const mediaIds = [
      ...new Set([previousCoverImage, previousMetaImage, ...previousScreenshots].filter(Boolean)),
    ] as string[]
    const externalScreenshotUrls = (rawg.short_screenshots ?? [])
      .map((screenshot) => screenshot.image)
      .filter(isAllowedRawgImageUrl)
      .filter((url, index, urls) => urls.indexOf(url) === index)

    const entry: ManifestEntry = {
      externalCoverUrl: rawg.background_image,
      externalScreenshotUrls,
      gameId,
      media: mediaIds.map((id) => rawMedia.get(id) ?? { filenames: [], id, keepFilenames: [] }),
      previousCoverImage,
      previousMetaImage,
      previousScreenshots,
      rawgId: rawg.id,
      rawgSlug: rawg.slug,
      status: 'pending',
      title: game.title,
    }

    matched++
    console.log(
      `  ${APPLY ? '↻' : '✓'} ${game.title}: 1 cover + ${externalScreenshotUrls.length} screenshots`,
    )

    if (APPLY && manifestPath) {
      manifest.entries.push(entry)
      await atomicWriteManifest(manifestPath, manifest)

      await payload.update({
        collection: 'games',
        data: {
          coverImage: null,
          externalCoverUrl: entry.externalCoverUrl,
          externalScreenshots: entry.externalScreenshotUrls.map((url) => ({ url })),
          meta: { ...(game.meta ?? {}), image: null },
          rawgId: entry.rawgId,
          rawgSlug: entry.rawgSlug,
          screenshots: [],
        } as any,
        draft: game._status === 'draft',
        id: gameId,
        overrideAccess: true,
      })

      entry.status = 'migrated'
      await atomicWriteManifest(manifestPath, manifest)
    }

    await pause(75)
  }

  console.log(
    `\n${APPLY ? 'Migration' : 'Dry run'} complete: ${matched} matched, ${unresolved} unresolved.`,
  )
  if (!APPLY)
    console.log('No database records or files were changed. Re-run with --apply to migrate.')
}

const collectReferencedMedia = async (candidateIds: Set<string>): Promise<Set<string>> => {
  const referenced = new Set<string>()
  const visit = (value: unknown) => {
    if (typeof value === 'string') {
      if (candidateIds.has(value)) referenced.add(value)
      return
    }
    if (Array.isArray(value)) {
      value.forEach(visit)
      return
    }
    if (value && typeof value === 'object') Object.values(value).forEach(visit)
  }

  for (const collection of [
    'pages',
    'articles',
    'reviews',
    'games',
    'categories',
    'genres',
    'gameLengths',
    'narrativeTags',
    'users',
  ]) {
    visit(await getAllDocs(collection, false))
    if (['pages', 'articles', 'reviews', 'games'].includes(collection)) {
      visit(await getAllDocs(collection, true))
    }
  }

  for (const slug of ['header', 'footer']) {
    visit(
      await payload.findGlobal({ slug: slug as any, depth: 0, draft: true, overrideAccess: true }),
    )
  }

  return referenced
}

const createArchive = async (filenames: string[], manifestPath: string): Promise<string | null> => {
  const existing: string[] = []
  for (const filename of filenames) {
    if (path.basename(filename) !== filename) throw new Error(`Unsafe media filename: ${filename}`)
    try {
      await fs.access(path.join(MEDIA_DIR, filename))
      existing.push(filename)
    } catch {
      // Missing legacy files are reported by the manifest and do not block cleanup.
    }
  }

  if (existing.length === 0) return null

  const listPath = `${manifestPath}.files.txt`
  const archivePath = `${manifestPath}.media-backup.tar.gz`
  await fs.writeFile(listPath, `${existing.join('\n')}\n`, 'utf8')
  await runFile('tar', ['-czf', archivePath, '-C', MEDIA_DIR, '-T', listPath])
  return archivePath
}

const cleanup = async () => {
  const { manifest, manifestPath } = await readManifest()
  const migratedEntries = manifest.entries.filter((entry) => entry.status === 'migrated')
  const assets = new Map<string, MediaSnapshot>()
  for (const entry of migratedEntries) {
    for (const media of entry.media) assets.set(media.id, media)
  }

  const candidateIds = new Set(assets.keys())
  const rawMedia = await loadRawMedia()
  const allReferenced = await collectReferencedMedia(new Set(rawMedia.keys()))
  const referenced = new Set([...candidateIds].filter((id) => allReferenced.has(id)))
  const alreadyDeleted = new Set(manifest.cleanup?.deletedMediaIds ?? [])
  const alreadyPruned = new Set(manifest.cleanup?.prunedMediaIds ?? [])
  const deletableIds = [...candidateIds].filter(
    (id) => !referenced.has(id) && !alreadyDeleted.has(id),
  )
  const prunableIds = [...allReferenced].filter(
    (id) => !deletableIds.includes(id) && !alreadyDeleted.has(id) && !alreadyPruned.has(id),
  )
  const legacyVariants = prunableIds.flatMap((id) => {
    const media = rawMedia.get(id)
    if (!media) return []
    const keep = new Set(media.keepFilenames)
    return media.filenames.filter((filename) => !keep.has(filename))
  })

  console.log(
    `Cleanup ${APPLY ? 'apply' : 'dry run'}: ${deletableIds.length} migrated media records can be deleted; ${legacyVariants.length} legacy variants can be pruned from referenced media; ${referenced.size} migrated records remain shared.`,
  )
  if (!APPLY) {
    console.log(
      'No database records or files were changed. Re-run with --apply to archive and delete.',
    )
    return
  }

  if (!manifest.cleanup) {
    const filenames = [
      ...deletableIds.flatMap((id) => assets.get(id)?.filenames ?? []),
      ...legacyVariants,
    ]
    const archivePath = await createArchive([...new Set(filenames)], manifestPath)
    manifest.cleanup = {
      archivePath,
      deletedMediaIds: [],
      prunedMediaIds: [],
      retainedReferencedIds: [...allReferenced],
    }
    await atomicWriteManifest(manifestPath, manifest)
    console.log(
      archivePath ? `Media backup: ${archivePath}` : 'No existing files needed archiving.',
    )
  }
  manifest.cleanup.prunedMediaIds ??= []

  for (const id of deletableIds) {
    try {
      await payload.delete({ collection: 'media', id, overrideAccess: true })
    } catch (error) {
      const rawModel = payload.db.collections.media as any
      const ObjectId = (payload.db as any).connection.base.Types.ObjectId
      const stillExists = await rawModel.collection.findOne({ _id: new ObjectId(id) })
      if (stillExists) throw error
    }

    for (const filename of assets.get(id)?.filenames ?? []) {
      if (path.basename(filename) !== filename)
        throw new Error(`Unsafe media filename: ${filename}`)
      await fs.rm(path.join(MEDIA_DIR, filename), { force: true })
    }

    manifest.cleanup.deletedMediaIds.push(id)
    await atomicWriteManifest(manifestPath, manifest)
  }

  const rawModel = payload.db.collections.media as any
  const ObjectId = (payload.db as any).connection.base.Types.ObjectId

  for (const id of prunableIds) {
    const media = rawMedia.get(id)
    if (!media) continue
    const keep = new Set(media.keepFilenames)

    for (const filename of media.filenames) {
      if (keep.has(filename)) continue
      if (path.basename(filename) !== filename)
        throw new Error(`Unsafe media filename: ${filename}`)
      await fs.rm(path.join(MEDIA_DIR, filename), { force: true })
    }

    await rawModel.collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $unset: {
          'sizes.large': 1,
          'sizes.medium': 1,
          'sizes.og': 1,
          'sizes.small': 1,
          'sizes.square': 1,
          'sizes.xlarge': 1,
        },
      },
    )
    manifest.cleanup.prunedMediaIds.push(id)
    await atomicWriteManifest(manifestPath, manifest)
  }

  manifest.cleanup.completedAt = new Date().toISOString()
  manifest.cleanup.retainedReferencedIds = [...allReferenced]
  await atomicWriteManifest(manifestPath, manifest)
  console.log(
    `Cleanup complete: ${manifest.cleanup.deletedMediaIds.length} media records deleted; ${manifest.cleanup.prunedMediaIds.length} referenced records reduced to original + thumbnail.`,
  )
}

const rollback = async () => {
  const { manifest, manifestPath } = await readManifest()
  if ((manifest.cleanup?.deletedMediaIds.length ?? 0) > 0) {
    throw new Error(
      'Rollback is disabled because cleanup already deleted media. Restore the backup first.',
    )
  }

  const entries = manifest.entries.filter((entry) => entry.status !== 'rolledBack')
  console.log(`Rollback ${APPLY ? 'apply' : 'dry run'}: ${entries.length} games can be restored.`)
  if (!APPLY) {
    console.log('No database records were changed. Re-run with --apply to restore relationships.')
    return
  }

  for (const entry of entries) {
    const game = await payload.findByID({
      collection: 'games',
      depth: 0,
      id: entry.gameId,
      overrideAccess: true,
    })
    await payload.update({
      collection: 'games',
      data: {
        coverImage: entry.previousCoverImage,
        externalCoverUrl: null,
        externalScreenshots: [],
        meta: { ...(game.meta ?? {}), image: entry.previousMetaImage },
        rawgId: null,
        rawgSlug: null,
        screenshots: entry.previousScreenshots,
      } as any,
      draft: game._status === 'draft',
      id: entry.gameId,
      overrideAccess: true,
    })
    entry.status = 'rolledBack'
    await atomicWriteManifest(manifestPath, manifest)
  }

  console.log('Rollback complete.')
}

const run = async () => {
  if (CLEANUP && ROLLBACK) throw new Error('Choose either --cleanup or --rollback, not both.')

  const config = (await import('../src/payload.config')).default
  await payload.init({ config })

  if (CLEANUP) await cleanup()
  else if (ROLLBACK) await rollback()
  else await migrate()

  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
