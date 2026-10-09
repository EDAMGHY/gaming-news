import 'dotenv/config'
import fetch from 'node-fetch'
import payload from 'payload'
import { isAllowedRawgImageUrl } from '../src/utilities/gameMedia'

/**
 * Additive content seed for the Gaming News homepage.
 *
 * Creates REAL upcoming games (with future release dates so the "Upcoming Games"
 * section is populated), real articles, and real reviews — then rewires the
 * existing home page doc to feature them. It NEVER deletes existing data and
 * skips anything that already exists (guarded by slug/title), so it is safe to
 * re-run.
 *
 * Run with:  pnpm seed:content
 */

const RAWG_API_BASE = 'https://api.rawg.io/api'
const RAWG_API_KEY = process.env.RAWG_API_KEY || ''
const HOME_PAGE_ID = process.env.HOME_PAGE_ID || '689fce85bce094e9af4cd898'

const DAY = 24 * 60 * 60 * 1000

const platformMap: Record<string, string[]> = {
  PC: ['pc'],
  'PlayStation 5': ['ps5'],
  'PlayStation 4': ['ps4'],
  'Xbox Series S/X': ['xbox-series'],
  'Xbox One': ['xbox-one'],
  'Nintendo Switch': ['switch'],
  'Nintendo Switch 2': ['switch-2'],
  iOS: ['mobile'],
  Android: ['mobile'],
}

type PlatformValue =
  | 'pc'
  | 'ps5'
  | 'ps4'
  | 'xbox-series'
  | 'xbox-one'
  | 'switch'
  | 'switch-2'
  | 'mobile'

interface RAWGGame {
  id: number
  slug: string
  name: string
  released: string
  background_image: string
  platforms?: Array<{ platform: { name: string } }>
  genres?: Array<{ name: string }>
  short_screenshots?: Array<{ image: string }>
}

// ---------------------------------------------------------------------------
// Curated real games. `daysOut` is how far in the future to set the release
// date so they show up as "upcoming". `search` is used to fetch real cover art
// + genres + platforms from RAWG.
// ---------------------------------------------------------------------------
const CURATED_GAMES: Array<{
  title: string
  search: string
  daysOut: number
  developer?: string
  publisher?: string
  synopsis: string
}> = [
  {
    title: 'Assassin’s Creed IV: Black Flag — Remake',
    search: "Assassin's Creed IV Black Flag",
    daysOut: 120,
    developer: 'Ubisoft',
    publisher: 'Ubisoft',
    synopsis:
      'A ground-up remake of the beloved pirate-era adventure, rebuilt with modern visuals, reworked naval combat, and an expanded Caribbean to explore.',
  },
  {
    title: 'Hollow Knight: Silksong',
    search: 'Hollow Knight Silksong',
    daysOut: 90,
    developer: 'Team Cherry',
    publisher: 'Team Cherry',
    synopsis:
      'Ascend a haunted kingdom as Hornet in this long-awaited sequel packed with new lands, spells, and deadly enemies.',
  },
  {
    title: 'Death Stranding 2: On the Beach',
    search: 'Death Stranding 2',
    daysOut: 110,
    developer: 'Kojima Productions',
    publisher: 'Sony Interactive Entertainment',
    synopsis:
      'Sam Porter Bridges returns to reconnect a fractured world in Hideo Kojima’s surreal, genre-defying sequel.',
  },
  {
    title: 'Metroid Prime 4: Beyond',
    search: 'Metroid Prime 4',
    daysOut: 140,
    developer: 'Retro Studios',
    publisher: 'Nintendo',
    synopsis:
      'Samus Aran returns in a first-person action-adventure that blends exploration, combat, and atmospheric sci-fi mystery.',
  },
  {
    title: 'The Witcher IV',
    search: 'The Witcher 3 Wild Hunt',
    daysOut: 300,
    developer: 'CD Projekt Red',
    publisher: 'CD Projekt',
    synopsis:
      'A new saga begins on the Continent, powered by a next-generation engine and a fresh Witcher protagonist.',
  },
  {
    title: 'Ghost of Yōtei',
    search: 'Ghost of Tsushima',
    daysOut: 180,
    developer: 'Sucker Punch Productions',
    publisher: 'Sony Interactive Entertainment',
    synopsis:
      'A new open-world samurai epic set in a breathtaking, wind-swept frontier centuries after the tale of Tsushima.',
  },
  {
    title: 'Fable',
    search: 'Fable Anniversary',
    daysOut: 210,
    developer: 'Playground Games',
    publisher: 'Xbox Game Studios',
    synopsis:
      'A witty, fantastical reboot of the classic RPG series, returning players to a living, storybook world of Albion.',
  },
  {
    title: 'Marvel’s Wolverine',
    search: "Marvel's Spider-Man",
    daysOut: 330,
    developer: 'Insomniac Games',
    publisher: 'Sony Interactive Entertainment',
    synopsis:
      'A brutal, story-driven single-player adventure starring Logan, from the studio behind Marvel’s Spider-Man.',
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function downloadImage(imageUrl: string): Promise<Buffer> {
  const response = await fetch(imageUrl)
  if (!response.ok) throw new Error(`Failed to download image: ${response.statusText}`)
  return Buffer.from(await response.arrayBuffer())
}

async function getOrCreateEditorialImage(
  label: string,
  imageUrl: string,
  altText: string,
): Promise<string | null> {
  try {
    if (!isAllowedRawgImageUrl(imageUrl)) return null

    const existing = await payload.find({
      collection: 'media',
      limit: 1,
      where: { alt: { equals: altText } },
    })
    if (existing.docs[0]) return String(existing.docs[0].id)

    const imageBuffer = await downloadImage(imageUrl)
    const fileName = `${label.replace(/[^\w]/g, '-').replace(/-+/g, '-')}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 9)}.jpg`
    const media = await payload.create({
      collection: 'media',
      data: { alt: altText },
      file: {
        name: fileName,
        data: imageBuffer,
        mimetype: 'image/jpeg',
        size: imageBuffer.length,
      } as any,
    })
    return String(media.id)
  } catch (error) {
    console.warn(`⚠️  Failed to upload image for "${label}":`, (error as Error).message)
    return null
  }
}

async function getOrCreateCategory(title: string): Promise<string> {
  const found = await payload.find({
    collection: 'categories',
    where: { title: { equals: title } },
    limit: 1,
  })
  if (found.docs.length) return String(found.docs[0].id)
  const created = await payload.create({ collection: 'categories', data: { title } })
  return String(created.id)
}

async function getOrCreateGenres(genreNames: string[]): Promise<string[]> {
  const ids: string[] = []
  for (const name of genreNames) {
    const found = await payload.find({
      collection: 'genres',
      where: { name: { equals: name } },
      limit: 1,
    })
    if (found.docs.length) ids.push(String(found.docs[0].id))
    else {
      const created = await payload.create({ collection: 'genres', data: { name } })
      ids.push(String(created.id))
    }
  }
  return ids
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

type Node = { type: 'h2' | 'h3' | 'p'; text: string }
function lexical(nodes: Node[]) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: nodes.map((n) =>
        n.type === 'p'
          ? {
              type: 'paragraph',
              version: 1,
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              children: [
                {
                  type: 'text',
                  version: 1,
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: n.text,
                },
              ],
            }
          : {
              type: 'heading',
              tag: n.type,
              version: 1,
              direction: 'ltr',
              format: '',
              indent: 0,
              children: [
                {
                  type: 'text',
                  version: 1,
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: n.text,
                },
              ],
            },
      ),
    },
  }
}

async function fetchRawg(search: string): Promise<RAWGGame | null> {
  const url = `${RAWG_API_BASE}/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(
    search,
  )}&search_precise=true&page_size=1`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`RAWG error: ${res.statusText}`)
  const data = (await res.json()) as { results: RAWGGame[] }
  return data.results?.[0] ?? null
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function seed() {
  try {
    if (!RAWG_API_KEY) throw new Error('RAWG_API_KEY environment variable is not set')

    const config = (await import('../src/payload.config')).default
    await payload.init({ config, onInit: async () => console.log('✅ Payload initialized') })

    // --- Categories ---------------------------------------------------------
    console.log('\n📁 Ensuring categories exist...')
    const catNews = await getOrCreateCategory('News')
    const catPreviews = await getOrCreateCategory('Previews')
    const catFeatures = await getOrCreateCategory('Features')
    const catGuides = await getOrCreateCategory('Guides')
    const catReviews = await getOrCreateCategory('Reviews')

    // --- Upcoming games -----------------------------------------------------
    console.log('\n🎮 Seeding upcoming games...')
    const now = Date.now()
    const createdGames: Array<{ id: string; title: string; editorialImageId: string | null }> = []

    for (const game of CURATED_GAMES) {
      const slug = slugify(game.title)

      const existing = await payload.find({
        collection: 'games',
        where: { slug: { equals: slug } },
        limit: 1,
      })
      if (existing.docs.length) {
        console.log(`  ⏭️  Skipping existing game: ${game.title}`)
        const doc: any = existing.docs[0]
        const externalCoverUrl = isAllowedRawgImageUrl(doc.externalCoverUrl)
          ? doc.externalCoverUrl
          : null
        const editorialImageId = doc.coverImage
          ? String(doc.coverImage.id ?? doc.coverImage)
          : externalCoverUrl
            ? await getOrCreateEditorialImage(
                `${game.title}-editorial`,
                externalCoverUrl,
                `${game.title} editorial image`,
              )
            : null
        createdGames.push({
          id: String(doc.id),
          title: game.title,
          editorialImageId,
        })
        continue
      }

      let rawg: RAWGGame | null = null
      try {
        rawg = await fetchRawg(game.search)
      } catch (e) {
        console.warn(`  ⚠️  RAWG lookup failed for "${game.search}"`)
      }

      const externalCoverUrl = isAllowedRawgImageUrl(rawg?.background_image)
        ? rawg.background_image
        : undefined
      const externalScreenshotUrls = (rawg?.short_screenshots || [])
        .map((shot) => shot.image)
        .filter(isAllowedRawgImageUrl)
        .filter((url, index, urls) => urls.indexOf(url) === index)
        .slice(0, 4)
      const editorialImageId = externalCoverUrl
        ? await getOrCreateEditorialImage(
            `${game.title}-editorial`,
            externalCoverUrl,
            `${game.title} editorial image`,
          )
        : null

      const platforms = [
        ...new Set(
          (rawg?.platforms || [])
            .flatMap((p) => platformMap[p.platform.name] || [])
            .filter(Boolean),
        ),
      ] as PlatformValue[]
      const genreIds = await getOrCreateGenres((rawg?.genres || []).map((g) => g.name))

      const releaseDate = new Date(now + game.daysOut * DAY).toISOString()

      const created = await payload.create({
        collection: 'games',
        data: {
          title: game.title,
          slug,
          releaseDate,
          platforms: platforms.length ? platforms : ['pc'],
          genres: genreIds,
          rawgId: rawg?.id,
          rawgSlug: rawg?.slug,
          externalCoverUrl,
          externalScreenshots: externalScreenshotUrls.map((url) => ({ url })),
          developer: game.developer,
          publisher: game.publisher,
          synopsis: game.synopsis,
          _status: 'published',
          meta: {
            title: game.title,
            description: game.synopsis,
          },
        },
      })
      createdGames.push({ id: String(created.id), title: game.title, editorialImageId })
      console.log(`  ✅ ${game.title} (releases ${releaseDate.slice(0, 10)})`)
    }

    const gameCover = (i: number) =>
      createdGames.find((g) => g.editorialImageId)?.editorialImageId
        ? createdGames.filter((g) => g.editorialImageId)[
            i % createdGames.filter((g) => g.editorialImageId).length
          ].editorialImageId
        : null

    // --- Articles -----------------------------------------------------------
    console.log('\n📰 Seeding articles...')
    const articleDefs: Array<{
      title: string
      category: string
      featured: boolean
      daysAgo: number
      body: Node[]
    }> = [
      {
        title: 'Assassin’s Creed IV: Black Flag Remake — Everything We Know So Far',
        category: catPreviews,
        featured: true,
        daysAgo: 1,
        body: [
          {
            type: 'p',
            text: 'Ubisoft is rebuilding one of its most-loved entries from the ground up, and the early details paint an ambitious picture.',
          },
          { type: 'h2', text: 'A bigger, bolder Caribbean' },
          {
            type: 'p',
            text: 'Expect reworked naval combat, denser islands, and a fully modernised lighting system that makes the open seas feel more alive than ever.',
          },
        ],
      },
      {
        title: 'GTA VI: Release Window, Map, and Everything Rockstar Has Confirmed',
        category: catNews,
        featured: true,
        daysAgo: 2,
        body: [
          {
            type: 'p',
            text: 'The most anticipated game of the decade is inching closer. Here is a running list of everything that has been officially confirmed.',
          },
          { type: 'h2', text: 'Back to Vice City' },
          {
            type: 'p',
            text: 'A sprawling, modern take on the neon-soaked city anchors a story that Rockstar promises is its most ambitious yet.',
          },
        ],
      },
      {
        title: 'The Best Upcoming RPGs to Watch This Year',
        category: catFeatures,
        featured: true,
        daysAgo: 3,
        body: [
          {
            type: 'p',
            text: 'From sprawling open worlds to tight, story-driven adventures, the RPG calendar is stacked. These are the ones worth clearing your schedule for.',
          },
          { type: 'h2', text: 'Where old and new collide' },
          {
            type: 'p',
            text: 'Long-running franchises are meeting bold new IP head-on, and the result is one of the strongest line-ups in years.',
          },
        ],
      },
      {
        title: 'Silksong Hands-On: The Wait Might Actually Be Worth It',
        category: catPreviews,
        featured: false,
        daysAgo: 5,
        body: [
          {
            type: 'p',
            text: 'After years of anticipation, we finally went hands-on with Hornet’s adventure. It is faster, meaner, and more beautiful than we hoped.',
          },
          { type: 'h2', text: 'A new kingdom to conquer' },
          {
            type: 'p',
            text: 'Silksong builds on everything that made the original a classic while carving out an identity all its own.',
          },
        ],
      },
      {
        title: 'A Beginner’s Guide to the Extraction Shooter Genre',
        category: catGuides,
        featured: false,
        daysAgo: 7,
        body: [
          {
            type: 'p',
            text: 'High stakes, high reward. Extraction shooters can be intimidating — here is how to survive your first raids and actually have fun.',
          },
          { type: 'h2', text: 'Loot, fight, escape' },
          {
            type: 'p',
            text: 'Master the core loop, learn when to disengage, and you will be walking away with loot in no time.',
          },
        ],
      },
      {
        title: 'The State of the Games Industry in 2026',
        category: catFeatures,
        featured: false,
        daysAgo: 9,
        body: [
          {
            type: 'p',
            text: 'Between blockbuster delays, a booming indie scene, and shifting business models, the industry is at a fascinating crossroads.',
          },
          { type: 'h2', text: 'What comes next' },
          {
            type: 'p',
            text: 'We break down the trends shaping how games are made, sold, and played over the coming year.',
          },
        ],
      },
    ]

    let coverIdx = 0
    for (const def of articleDefs) {
      const slug = slugify(def.title)
      const existing = await payload.find({
        collection: 'articles',
        where: { slug: { equals: slug } },
        limit: 1,
      })
      if (existing.docs.length) {
        console.log(`  ⏭️  Skipping existing article: ${def.title}`)
        continue
      }
      const heroId = gameCover(coverIdx++)
      await payload.create({
        collection: 'articles',
        context: { disableRevalidate: true },
        data: {
          title: def.title,
          slug,
          isFeatured: def.featured,
          heroImage: heroId,
          primaryCategory: def.category,
          categories: [def.category],
          content: lexical(def.body) as any,
          publishedAt: new Date(now - def.daysAgo * DAY).toISOString(),
          _status: 'published',
          meta: {
            title: def.title,
            description: def.body.find((n) => n.type === 'p')?.text,
            image: heroId,
          },
        } as any,
      })
      console.log(`  ✅ ${def.title}${def.featured ? ' (featured)' : ''}`)
    }

    // --- Reviews (tied to existing published games) -------------------------
    console.log('\n⭐ Seeding reviews...')
    const publishedGames = await payload.find({
      collection: 'games',
      where: { _status: { equals: 'published' } },
      limit: 8,
      depth: 0,
    })

    const reviewTemplates: Array<{
      rating: number
      excerpt: string
      pros: string[]
      cons: string[]
      body: Node[]
    }> = [
      {
        rating: 4.5,
        excerpt: 'A confident, polished experience that rarely puts a foot wrong.',
        pros: ['Gorgeous art direction', 'Tight, responsive controls', 'Meaningful progression'],
        cons: ['Occasional difficulty spikes', 'Story loses steam late'],
        body: [
          {
            type: 'p',
            text: 'This is the kind of release that reminds you why you fell in love with the medium in the first place.',
          },
          { type: 'h2', text: 'Verdict' },
          {
            type: 'p',
            text: 'A near-essential experience that will stick with you long after the credits roll.',
          },
        ],
      },
      {
        rating: 4,
        excerpt:
          'Ambitious and frequently brilliant, even if it bites off a little more than it can chew.',
        pros: ['Huge, detailed world', 'Excellent soundtrack', 'Memorable set pieces'],
        cons: ['Uneven pacing', 'A few rough technical edges'],
        body: [
          {
            type: 'p',
            text: 'For every moment that stumbles, there are three that soar. This is a bold swing that mostly connects.',
          },
          { type: 'h2', text: 'Verdict' },
          {
            type: 'p',
            text: 'Flawed but unforgettable — well worth your time if you can look past the rough edges.',
          },
        ],
      },
      {
        rating: 3.5,
        excerpt: 'A solid, enjoyable ride that plays it a little too safe.',
        pros: ['Approachable and fun', 'Great for newcomers', 'Consistent quality'],
        cons: ['Rarely surprises', 'Thin end-game'],
        body: [
          {
            type: 'p',
            text: 'There is a lot to like here, even if it never quite reaches the heights of its peers.',
          },
          { type: 'h2', text: 'Verdict' },
          { type: 'p', text: 'Comfortable and competent — a good pick, just not a landmark one.' },
        ],
      },
    ]

    let rIdx = 0
    for (const game of publishedGames.docs.slice(0, reviewTemplates.length)) {
      const g: any = game
      const title = `${g.title} Review`
      const slug = slugify(title)
      const existing = await payload.find({
        collection: 'reviews',
        where: { slug: { equals: slug } },
        limit: 1,
      })
      if (existing.docs.length) {
        console.log(`  ⏭️  Skipping existing review: ${title}`)
        rIdx++
        continue
      }
      const tpl = reviewTemplates[rIdx % reviewTemplates.length]
      const heroId = g.coverImage ? String(g.coverImage.id ?? g.coverImage) : gameCover(rIdx)
      await payload.create({
        collection: 'reviews',
        context: { disableRevalidate: true },
        data: {
          title,
          slug,
          game: String(g.id),
          heroImage: heroId,
          rating: tpl.rating,
          excerpt: tpl.excerpt,
          platformTested: g.platforms?.[0],
          hoursPlayed: 28 + rIdx * 14,
          testedVersion: 'Launch build with the latest available patch',
          disclosure:
            'The review copy was provided by the publisher. The publisher had no editorial input.',
          pros: tpl.pros.map((text) => ({ text })),
          cons: tpl.cons.map((text) => ({ text })),
          content: lexical(tpl.body) as any,
          categories: [catReviews],
          publishedAt: new Date(now - (rIdx + 1) * 2 * DAY).toISOString(),
          _status: 'published',
          meta: { title, description: tpl.excerpt, image: heroId },
        } as any,
      })
      console.log(`  ✅ ${title} (${tpl.rating}/5)`)
      rIdx++
    }

    // --- Rewire the existing home page --------------------------------------
    console.log('\n🏠 Updating home page layout...')
    await updateHome(gameCover(0))

    console.log('\n✅ Content seeding complete!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Content seeding failed:', error)
    process.exit(1)
  }
}

async function updateHome(heroImageId: string | null) {
  // Wire the featured slider to our real, curated articles by slug so it never
  // surfaces older placeholder articles that happen to be flagged isFeatured.
  const featuredSlugs = [
    'assassins-creed-iv-black-flag-remake-everything-we-know-so-f',
    'gta-vi-release-window-map-and-everything-rockstar-has-confir',
    'the-best-upcoming-rpgs-to-watch-this-year',
    'silksong-hands-on-the-wait-might-actually-be-worth-it',
    'the-state-of-the-games-industry-in-2026',
  ]
  const featured = await payload.find({
    collection: 'articles',
    where: { slug: { in: featuredSlugs }, _status: { equals: 'published' } },
    limit: 6,
    depth: 0,
    sort: '-publishedAt',
  })
  const featuredIds = featured.docs.map((d) => String(d.id))

  const reviews = await payload.find({
    collection: 'reviews',
    where: { _status: { equals: 'published' } },
    limit: 4,
    depth: 0,
    sort: '-publishedAt',
  })
  const reviewIds = reviews.docs.map((d) => String(d.id))

  const hero = {
    type: 'highImpact',
    media: heroImageId,
    richText: lexical([
      { type: 'h2', text: 'Your front row seat to gaming' },
      {
        type: 'p',
        text: 'Breaking news, honest reviews, and the biggest upcoming releases — all in one place.',
      },
    ]),
    links: [
      { link: { type: 'custom', appearance: 'default', label: 'Read Articles', url: '/articles' } },
      { link: { type: 'custom', appearance: 'outline', label: 'Browse Games', url: '/games' } },
    ],
  }

  const layout: any[] = [
    {
      blockType: 'latest-articles',
      blockName: 'Latest News',
      title: 'Latest News',
      description: 'The freshest stories from across the gaming world.',
      link: '/articles',
      limit: 6,
    },
    {
      blockType: 'featured-articles',
      blockName: 'Featured Stories',
      title: 'Featured Stories',
      description: lexical([
        { type: 'p', text: 'Hand-picked features and deep dives you should not miss.' },
      ]),
      link: '/articles',
      articles: featuredIds,
    },
    {
      blockType: 'featuredReviews',
      blockName: 'Featured Reviews',
      title: 'Featured Reviews',
      description: 'In-depth verdicts on the games everyone is talking about.',
      link: '/reviews',
      reviews: reviewIds,
    },
    {
      blockType: 'grid-blocks',
      blockName: 'Reviews & Upcoming',
      blocks: [
        {
          blockType: 'topReviews',
          title: 'Top Rated',
          description: 'Our highest-scoring games.',
          link: '/reviews',
          limit: 6,
          minRating: 2,
        },
        {
          blockType: 'upcoming-games',
          title: 'Upcoming Releases',
          description: 'Mark your calendar for the most anticipated games on the horizon.',
          link: '/games',
          limit: 6,
          rangePreset: '365d',
        },
      ],
    },
    {
      blockType: 'category-browse',
      blockName: 'Browse',
      title: 'Browse by Category',
      description: 'Jump straight to the topics and genres you care about.',
    },
    {
      blockType: 'cta',
      blockName: 'Community CTA',
      richText: lexical([
        { type: 'h2', text: 'Join our gaming community' },
        {
          type: 'p',
          text: 'Explore our full library of articles, reviews, and upcoming releases — and never miss a beat.',
        },
      ]),
      links: [
        {
          link: { type: 'custom', appearance: 'default', label: 'Read Articles', url: '/articles' },
        },
        {
          link: { type: 'custom', appearance: 'default', label: 'Browse Reviews', url: '/reviews' },
        },
      ],
    },
  ]

  await payload.update({
    collection: 'pages',
    id: HOME_PAGE_ID,
    context: { disableRevalidate: true },
    data: {
      hero: hero as any,
      layout: layout as any,
      _status: 'published',
    },
  })
  console.log(
    `  ✅ Home page updated (${featuredIds.length} featured articles, ${reviewIds.length} reviews wired)`,
  )
}

seed()
