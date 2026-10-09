import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

export type HeaderFeed = {
  reviews: { title: string; slug: string; rating: number | null; game: string | null }[]
  articles: { title: string; slug: string; category: string | null }[]
  genres: { id: string; name: string }[]
}

async function getHeaderFeed(): Promise<HeaderFeed> {
  const payload = await getPayload({ config: configPromise })

  const [reviews, articles, genres] = await Promise.all([
    payload.find({
      collection: 'reviews',
      depth: 1,
      limit: 3,
      sort: '-publishedAt',
      overrideAccess: false,
      select: { title: true, slug: true, rating: true, game: true },
      populate: { games: { title: true } },
    }),
    payload.find({
      collection: 'articles',
      depth: 1,
      limit: 3,
      sort: '-publishedAt',
      overrideAccess: false,
      select: { title: true, slug: true, categories: true },
      populate: { categories: { title: true } },
    }),
    payload.find({
      collection: 'genres',
      depth: 0,
      limit: 8,
      sort: 'name',
      overrideAccess: false,
      select: { name: true },
    }),
  ])

  return {
    reviews: reviews.docs
      .filter((r) => r.slug)
      .map((r) => ({
        title: r.title,
        slug: r.slug as string,
        rating: typeof r.rating === 'number' ? r.rating : null,
        game: typeof r.game === 'object' && r.game ? r.game.title : null,
      })),
    articles: articles.docs
      .filter((a) => a.slug)
      .map((a) => {
        const first = a.categories?.[0]
        return {
          title: a.title,
          slug: a.slug as string,
          category: typeof first === 'object' && first ? first.title : null,
        }
      }),
    genres: genres.docs.map((g) => ({ id: String(g.id), name: g.name })),
  }
}

/** Latest content for the header panels; refreshed every few minutes. */
export const getCachedHeaderFeed = unstable_cache(getHeaderFeed, ['header-feed'], {
  revalidate: 300,
  tags: ['header-feed'],
})
