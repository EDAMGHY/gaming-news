import 'dotenv/config'

import fs from 'node:fs/promises'
import path from 'node:path'
import { MongoClient, ObjectId } from 'mongodb'

const args = process.argv.slice(2)
const APPLY = args.includes('--apply')
const option = (name: string) =>
  args.find((argument) => argument.startsWith(`${name}=`))?.slice(name.length + 1)

const DATABASE_URI = process.env.DATABASE_URI
const MEDIA_DIR = path.resolve('public/media')
const REPORT_DIR = path.resolve('content-reset-backups')
const DATABASE_BACKUP_OPTION = option('--database-backup')
const MEDIA_BACKUP_OPTION = option('--media-backup')
const CONFIRMATION = option('--confirm')
const DATABASE_BACKUP = DATABASE_BACKUP_OPTION ? path.resolve(DATABASE_BACKUP_OPTION) : null
const MEDIA_BACKUP = MEDIA_BACKUP_OPTION ? path.resolve(MEDIA_BACKUP_OPTION) : null

const TARGET_COLLECTIONS = [
  '_articles_versions',
  '_games_versions',
  '_reviews_versions',
  'articles',
  'games',
  'media',
  'reviews',
  'searches',
] as const

type ScrubResult = {
  changed: boolean
  remove: boolean
  value: unknown
}

const asId = (value: unknown): string | null => {
  if (value instanceof ObjectId) return value.toHexString()
  if (typeof value === 'string' && /^[a-f\d]{24}$/i.test(value)) return value
  return null
}

const scrubReferences = (value: unknown, removedIds: Set<string>): ScrubResult => {
  const id = asId(value)
  if (id && removedIds.has(id)) return { changed: true, remove: true, value: null }

  if (Array.isArray(value)) {
    let changed = false
    const next = value.flatMap((item) => {
      const result = scrubReferences(item, removedIds)
      changed ||= result.changed
      return result.remove ? [] : [result.value]
    })
    return { changed, remove: false, value: changed ? next : value }
  }

  if (
    !value ||
    typeof value !== 'object' ||
    value instanceof Date ||
    value instanceof RegExp ||
    Buffer.isBuffer(value)
  ) {
    return { changed: false, remove: false, value }
  }

  const relationValue = 'value' in value ? asId((value as { value?: unknown }).value) : null
  if (relationValue && removedIds.has(relationValue)) {
    return { changed: true, remove: true, value: null }
  }

  let changed = false
  const next: Record<string, unknown> = {}
  for (const [key, child] of Object.entries(value)) {
    const result = scrubReferences(child, removedIds)
    changed ||= result.changed
    next[key] = result.remove ? null : result.value
  }

  return { changed, remove: false, value: changed ? next : value }
}

const countFiles = async (directory: string): Promise<number> => {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true })
    let total = 0
    for (const entry of entries) {
      total += entry.isDirectory()
        ? await countFiles(path.join(directory, entry.name))
        : entry.isFile()
          ? 1
          : 0
    }
    return total
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return 0
    throw error
  }
}

const requireBackup = async (backupPath: string) => {
  const stats = await fs.stat(backupPath)
  if (!stats.isFile() || stats.size === 0) {
    throw new Error(`Backup is missing or empty: ${backupPath}`)
  }
}

const main = async () => {
  if (!DATABASE_URI) throw new Error('DATABASE_URI is required.')
  if (MEDIA_DIR !== path.join(process.cwd(), 'public', 'media')) {
    throw new Error(`Refusing to reset unexpected media directory: ${MEDIA_DIR}`)
  }

  const client = new MongoClient(DATABASE_URI)
  await client.connect()

  try {
    const database = client.db()
    const availableCollections = new Set(
      (await database.listCollections({}, { nameOnly: true }).toArray()).map(({ name }) => name),
    )
    const counts: Record<string, number> = {}
    const removedIds = new Set<string>()

    for (const collectionName of TARGET_COLLECTIONS) {
      if (!availableCollections.has(collectionName)) {
        counts[collectionName] = 0
        continue
      }

      const collection = database.collection(collectionName)
      counts[collectionName] = await collection.countDocuments()
      if (!collectionName.startsWith('_') && collectionName !== 'searches') {
        const ids = await collection.find({}, { projection: { _id: 1 } }).toArray()
        ids.forEach(({ _id }) => removedIds.add(String(_id)))
      }
    }

    const mediaFileCount = await countFiles(MEDIA_DIR)
    console.log('Content reset inventory:')
    Object.entries(counts).forEach(([name, count]) => console.log(`  ${name}: ${count}`))
    console.log(`  media files: ${mediaFileCount}`)

    if (!APPLY) {
      console.log('\nDry run only. Re-run with --apply after verifying both backup archives.')
      return
    }

    if (CONFIRMATION !== 'RESET_PUBLIC_CONTENT') {
      throw new Error('Apply requires --confirm=RESET_PUBLIC_CONTENT.')
    }
    if (!DATABASE_BACKUP || !MEDIA_BACKUP) {
      throw new Error('Apply requires --database-backup=... and --media-backup=....')
    }
    await requireBackup(DATABASE_BACKUP)
    await requireBackup(MEDIA_BACKUP)

    let scrubbedDocuments = 0
    for (const collectionName of availableCollections) {
      if (TARGET_COLLECTIONS.includes(collectionName as (typeof TARGET_COLLECTIONS)[number])) {
        continue
      }

      const collection = database.collection(collectionName)
      const cursor = collection.find({})
      for await (const document of cursor) {
        const result = scrubReferences(document, removedIds)
        if (!result.changed || result.remove) continue
        await collection.replaceOne({ _id: document._id }, result.value as Record<string, unknown>)
        scrubbedDocuments++
      }
    }

    for (const collectionName of TARGET_COLLECTIONS) {
      if (availableCollections.has(collectionName)) {
        await database.collection(collectionName).deleteMany({})
      }
    }

    await fs.rm(MEDIA_DIR, { force: true, recursive: true })
    await fs.mkdir(MEDIA_DIR, { recursive: true })

    await fs.mkdir(REPORT_DIR, { recursive: true })
    const reportPath = path.join(REPORT_DIR, `reset-report-${Date.now()}.json`)
    await fs.writeFile(
      reportPath,
      `${JSON.stringify(
        {
          completedAt: new Date().toISOString(),
          counts,
          databaseBackup: DATABASE_BACKUP,
          mediaBackup: MEDIA_BACKUP,
          mediaFileCount,
          scrubbedDocuments,
        },
        null,
        2,
      )}\n`,
      'utf8',
    )

    console.log(`\nReset complete. Scrubbed ${scrubbedDocuments} retained documents.`)
    console.log(`Report: ${reportPath}`)
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
