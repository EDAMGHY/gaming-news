import 'dotenv/config'
import payload from 'payload'

/**
 * Detects and removes duplicate games/articles (by title, case-insensitive),
 * keeping the oldest record. When a duplicate is removed, its associated media
 * (coverImage, screenshots, heroImage, meta.image) is also deleted via Payload's
 * local API — which removes the original file AND every resized variant from
 * `public/media` — as long as no surviving document still references it.
 *
 * Usage:
 *   pnpm clean:duplicates            # DRY RUN — reports what would be removed
 *   pnpm clean:duplicates --execute  # actually deletes
 */

const EXECUTE = process.argv.includes('--execute')

type Doc = Record<string, any> & { id: string; title?: string; createdAt?: string }

/** Fetch every document in a collection (drafts included), relationships as IDs. */
async function getAllDocs(collection: 'games' | 'articles' | 'media'): Promise<Doc[]> {
  const docs: Doc[] = []
  let page = 1
  while (true) {
    const res = await payload.find({
      collection,
      depth: 0, // return relationship/upload fields as IDs, not populated objects
      limit: 200,
      page,
      pagination: true,
      overrideAccess: true,
    })
    docs.push(...(res.docs as Doc[]))
    if (!res.hasNextPage) break
    page++
  }
  return docs
}

/** Normalize a value that may be an ID string or a populated object into an ID string. */
function toId(value: unknown): string | null {
  if (!value) return null
  if (typeof value === 'string') return value
  if (typeof value === 'object' && 'id' in (value as any)) return String((value as any).id)
  return String(value)
}

/** Collect all media IDs a game/article references. */
function mediaIdsOf(doc: Doc): string[] {
  const ids: (string | null)[] = []
  ids.push(toId(doc.coverImage)) // games
  ids.push(toId(doc.heroImage)) // articles
  ids.push(toId(doc.meta?.image)) // both
  if (Array.isArray(doc.screenshots)) {
    for (const s of doc.screenshots) ids.push(toId(s)) // games
  }
  return ids.filter((v): v is string => Boolean(v))
}

/** Group docs by lowercased/trimmed title; return only groups with >1 member. */
function findDuplicateGroups(docs: Doc[]): Doc[][] {
  const byTitle = new Map<string, Doc[]>()
  for (const doc of docs) {
    const key = (doc.title ?? '').trim().toLowerCase()
    if (!key) continue
    const group = byTitle.get(key) ?? []
    group.push(doc)
    byTitle.set(key, group)
  }

  const groups: Doc[][] = []
  for (const group of byTitle.values()) {
    if (group.length > 1) {
      // Keep the oldest (earliest createdAt); delete the rest.
      group.sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime())
      groups.push(group)
    }
  }
  return groups
}

async function processCollection(collection: 'games' | 'articles'): Promise<Doc[]> {
  console.log('\n' + '═'.repeat(64))
  console.log(collection.toUpperCase())
  console.log('═'.repeat(64))

  const docs = await getAllDocs(collection)
  console.log(`Scanned ${docs.length} ${collection}.`)

  const groups = findDuplicateGroups(docs)
  if (groups.length === 0) {
    console.log(`✓ No duplicate ${collection} found.`)
    return []
  }

  const toDelete: Doc[] = []
  console.log(`\nFound ${groups.length} duplicated title(s):`)
  for (const group of groups) {
    const [keep, ...dups] = group
    console.log(`\n  • "${keep.title}" — ${group.length} copies`)
    console.log(`      keep   ${keep.id}  (created ${keep.createdAt})`)
    for (const d of dups) {
      console.log(`      remove ${d.id}  (created ${d.createdAt})`)
      toDelete.push(d)
    }
  }
  return toDelete
}

async function run() {
  if (!EXECUTE) {
    console.log('🔍 DRY RUN — no changes will be made. Re-run with --execute to apply.\n')
  } else {
    console.log('⚠️  EXECUTE MODE — deletions will be performed.\n')
  }

  const config = (await import('../src/payload.config')).default
  await payload.init({ config })
  console.log('✅ Payload initialized')

  // 1) Identify duplicate docs to remove.
  const gamesToDelete = await processCollection('games')
  const articlesToDelete = await processCollection('articles')
  const docsToDelete = [
    ...gamesToDelete.map((d) => ({ collection: 'games' as const, doc: d })),
    ...articlesToDelete.map((d) => ({ collection: 'articles' as const, doc: d })),
  ]

  // 2) Media owned by the docs we are about to delete.
  const candidateMedia = new Set<string>()
  for (const { doc } of docsToDelete) {
    for (const id of mediaIdsOf(doc)) candidateMedia.add(id)
  }

  // 3) Media still referenced by SURVIVING games/articles must be kept.
  const deletedIds = new Set(docsToDelete.map(({ doc }) => doc.id))
  const survivingMedia = new Set<string>()
  for (const collection of ['games', 'articles'] as const) {
    const docs = await getAllDocs(collection)
    for (const doc of docs) {
      if (deletedIds.has(doc.id)) continue
      for (const id of mediaIdsOf(doc)) survivingMedia.add(id)
    }
  }

  const mediaToDelete = [...candidateMedia].filter((id) => !survivingMedia.has(id))

  console.log('\n' + '═'.repeat(64))
  console.log('MEDIA (covers & screenshots of removed duplicates)')
  console.log('═'.repeat(64))
  if (mediaToDelete.length === 0) {
    console.log('✓ No unreferenced media to remove.')
  } else {
    console.log(`${mediaToDelete.length} media file(s) will be removed from public/media:`)
    for (const id of mediaToDelete) {
      const m = await payload.findByID({ collection: 'media', id, depth: 0, overrideAccess: true }).catch(() => null)
      console.log(`  • ${id}${m?.filename ? `  (${m.filename})` : ''}`)
    }
  }

  // 4) Summary / apply.
  console.log('\n' + '═'.repeat(64))
  console.log('SUMMARY')
  console.log('═'.repeat(64))
  console.log(`  duplicate games    : ${gamesToDelete.length}`)
  console.log(`  duplicate articles : ${articlesToDelete.length}`)
  console.log(`  media to remove    : ${mediaToDelete.length}`)

  if (!EXECUTE) {
    console.log('\n🔍 Dry run complete. Re-run with --execute to apply these changes.')
    process.exit(0)
  }

  // Delete docs first, then their now-orphaned media.
  console.log('\nApplying changes...')
  for (const { collection, doc } of docsToDelete) {
    await payload.delete({ collection, id: doc.id, overrideAccess: true })
    console.log(`  ✓ removed ${collection}: "${doc.title}" (${doc.id})`)
  }
  for (const id of mediaToDelete) {
    try {
      await payload.delete({ collection: 'media', id, overrideAccess: true })
      console.log(`  ✓ removed media: ${id}`)
    } catch (err) {
      console.warn(`  ⚠️  could not remove media ${id}:`, err instanceof Error ? err.message : err)
    }
  }

  console.log('\n✅ Cleanup complete.')
  process.exit(0)
}

run().catch((err) => {
  console.error('❌ Cleanup failed:', err)
  process.exit(1)
})
