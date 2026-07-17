import 'dotenv/config'
import fetch from 'node-fetch'
import payload from 'payload'
import fs from 'fs'
import path from 'path'

// RAWG API - Free tier (no auth needed)
const RAWG_API_BASE = 'https://api.rawg.io/api'
const RAWG_API_KEY = process.env.RAWG_API_KEY || ''
const SIZE_NUMBER = Number(process.env.SIZE_NUMBER) || 10 // Games per page
const START_PAGE = Number(process.env.START_PAGE) || 1
const END_PAGE = Number(process.env.END_PAGE) || 1
const AUTO_PUBLISH = process.env.AUTO_PUBLISH !== 'false' // Default to true

interface RAWGGame {
  id: number
  name: string
  released: string
  background_image: string
  description?: string
  description_raw?: string
  platforms: Array<{ platform: { name: string } }>
  genres: Array<{ name: string }>
  short_screenshots: Array<{ image: string }>
}

// Map RAWG platform names to your platform options
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

// Platform type options from your schema
type PlatformValue =
  | 'pc'
  | 'ps5'
  | 'ps4'
  | 'xbox-series'
  | 'xbox-one'
  | 'switch'
  | 'switch-2'
  | 'mobile'

async function downloadImage(imageUrl: string): Promise<Buffer> {
  const response = await fetch(imageUrl)
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`)
  }
  return Buffer.from(await response.arrayBuffer())
}

async function uploadImage(gameTitle: string, imageUrl: string, altText: string) {
  try {
    if (!imageUrl) return null

    const imageBuffer = await downloadImage(imageUrl)

    // Generate filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substr(2, 9)
    const fileName = `${gameTitle.replace(/[^\w]/g, '-')}-${timestamp}-${random}.jpg`

    // Create a File-like object for Payload
    const file = {
      name: fileName,
      data: imageBuffer,
      mimetype: 'image/jpeg',
      size: imageBuffer.length,
    }

    // Upload using Payload's local API
    const media = await payload.create({
      collection: 'media',
      data: {
        alt: altText,
      },
      file: file as any,
    })

    return media.id
  } catch (error) {
    console.warn(`⚠️  Failed to upload image for "${gameTitle}":`, error)
    return null
  }
}

async function uploadCoverImage(gameTitle: string, imageUrl: string) {
  console.log(`📥 Downloading cover for "${gameTitle}"...`)
  return uploadImage(gameTitle, imageUrl, `${gameTitle} cover image`)
}

async function uploadScreenshots(gameTitle: string, screenshotUrls: string[]) {
  console.log(`📸 Downloading ${screenshotUrls.length} screenshots for "${gameTitle}"...`)
  const screenshotIds: string[] = []

  for (let i = 0; i < screenshotUrls.length; i++) {
    const id = await uploadImage(gameTitle, screenshotUrls[i], `${gameTitle} screenshot ${i + 1}`)
    if (id) {
      screenshotIds.push(id)
    }
  }

  return screenshotIds
}

async function getOrCreateGenres(genreNames: string[]) {
  const genres = []
  for (const name of genreNames) {
    // Find or create genre
    const genre = await payload.find({
      collection: 'genres',
      where: { name: { equals: name } },
      limit: 1,
    })

    if (genre.docs.length === 0) {
      const created = await payload.create({
        collection: 'genres',
        data: { name },
      })
      genres.push(created.id)
    } else {
      genres.push(genre.docs[0].id)
    }
  }
  return genres
}

async function seedGames() {
  try {
    if (!RAWG_API_KEY) {
      throw new Error('RAWG_API_KEY environment variable is not set')
    }

    // Initialize Payload
    const config = (await import('../src/payload.config')).default
    await payload.init({
      config,
      onInit: async (_payload) => {
        console.log('✅ Payload initialized')
      },
    })

    console.log(`📖 Fetching games from RAWG API (pages ${START_PAGE}-${END_PAGE})...`)

    // Store created games for linking related games
    const createdGames: Array<{ id: string; title: string; genres: string[] }> = []
    let totalGamesSeeded = 0

    // Fetch games from multiple pages
    for (let currentPage = START_PAGE; currentPage <= END_PAGE; currentPage++) {
      console.log(`\n📄 Fetching page ${currentPage}...`)

      const response = await fetch(
        `${RAWG_API_BASE}/games?key=${RAWG_API_KEY}&page=${currentPage}&page_size=${SIZE_NUMBER}&ordering=-released&dates=2026-01-01,2026-07-15&search_precise=true`,
      )

      if (!response.ok) {
        throw new Error(`RAWG API error: ${response.statusText}`)
      }

      const data = (await response.json()) as { results: RAWGGame[] }
      const games = data.results

      if (games.length === 0) {
        console.log(`⚠️  No more games found at page ${currentPage}`)
        break
      }

      console.log(`Found ${games.length} games on page ${currentPage}`)

      for (const rawgGame of games) {
      try {
        // Map platforms
        const platforms: PlatformValue[] = []
        for (const platformObj of rawgGame.platforms || []) {
          const platformName = platformObj.platform.name
          const mapped = platformMap[platformName]
          if (mapped) {
            platforms.push(...(mapped as PlatformValue[]))
          }
        }

        // Ensure unique platforms
        const uniquePlatforms = [...new Set(platforms)]

        // Get or create genres
        const genreNames = rawgGame.genres.map((g) => g.name)
        const genreIds = await getOrCreateGenres(genreNames)

        // Create slug from title
        const slug = rawgGame.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .slice(0, 50)

        // Upload cover image
        const coverImageId = await uploadCoverImage(rawgGame.name, rawgGame.background_image)

        // Upload screenshots
        const screenshotUrls = (rawgGame.short_screenshots || [])
          .filter((s) => s.image)
          .map((s) => s.image)
        const screenshotIds = await uploadScreenshots(rawgGame.name, screenshotUrls)

        // Extract synopsis from description
        const synopsis = rawgGame.description_raw
          ? rawgGame.description_raw.replace(/<[^>]*>/g, '').slice(0, 500)
          : rawgGame.description
            ? rawgGame.description.slice(0, 500)
            : `A game released on ${rawgGame.released}`

        // Create game record
        console.log(`🎮 Creating game: ${rawgGame.name}`)

        const createdGame = await payload.create({
          collection: 'games',
          data: {
            title: rawgGame.name,
            slug,
            releaseDate: rawgGame.released || undefined,
            platforms: uniquePlatforms,
            genres: genreIds,
            coverImage: coverImageId,
            screenshots: screenshotIds,
            synopsis: synopsis.trim(),
            published: AUTO_PUBLISH,
            meta: {
              title: rawgGame.name,
              description: synopsis.trim(),
              image: coverImageId,
            },
          },
        })

        // Store created game info for later linking
        createdGames.push({
          id: createdGame.id,
          title: createdGame.title,
          genres: genreIds,
        })

        totalGamesSeeded++
        const publishStatus = AUTO_PUBLISH ? '✅ (Published)' : '⏳ (Draft)'
        console.log(`  ${publishStatus} ${rawgGame.name}`)
      } catch (error) {
        console.error(`Error creating game "${rawgGame.name}":`, error)
      }
      }
    } // End of page loop

    console.log(`\n✅ Total games seeded: ${totalGamesSeeded}`)

    // Link related games based on shared genres
    console.log('🔗 Linking related games based on shared genres...')
    for (let i = 0; i < createdGames.length; i++) {
      const game = createdGames[i]
      const relatedGames = createdGames
        .filter((other, index) => {
          if (index === i) return false
          // Find games with at least one shared genre
          return other.genres.some((genre) => game.genres.includes(genre))
        })
        .slice(0, 3) // Limit to 3 related games
        .map((g) => g.id)

      if (relatedGames.length > 0) {
        try {
          await payload.update({
            collection: 'games',
            id: game.id,
            data: {
              relatedGames,
            },
          })
          console.log(`✅ Linked ${relatedGames.length} related games to "${game.title}"`)
        } catch (error) {
          console.warn(`⚠️  Failed to link related games for "${game.title}":`, error)
        }
      }
    }

    const publishInfo = AUTO_PUBLISH ? '(All games published)' : '(All games in draft mode)'
    console.log(`✅ Seeding complete! ${publishInfo}`)

    // Cleanup temp images
    const tempDir = path.join(process.cwd(), '.temp-images')
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)

    // Cleanup on error
    const tempDir = path.join(process.cwd(), '.temp-images')
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }

    process.exit(1)
  }
}

seedGames()
