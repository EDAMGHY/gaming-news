import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Game } from '@/payload-types'

import { GameHero } from '@/heros/GameHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { RelatedReviews } from '@/blocks/RelatedReviews/Component'
import { GameScreenshots } from '@/components/GameScreenshots'
import { Gamepad2, Tag } from 'lucide-react'
import { format } from 'date-fns'

const platformLabels: Record<string, string> = {
  pc: 'PC',
  ps5: 'PlayStation 5',
  ps4: 'PlayStation 4',
  'xbox-series': 'Xbox Series X|S',
  'xbox-one': 'Xbox One',
  switch: 'Nintendo Switch',
  'switch-2': 'Nintendo Switch 2',
  mobile: 'Mobile',
}

// TODO: Fix the type error with GameHero before enabling static generation
// export async function generateStaticParams() {
//   const payload = await getPayload({ config: configPromise })
//   const games = await payload.find({
//     collection: 'games',
//     draft: false,
//     limit: 1000,
//     overrideAccess: false,
//     pagination: false,
//     select: {
//       slug: true,
//     },
//   })

//   const params = games.docs.map(({ slug }) => {
//     return { slug }
//   })

//   return params
// }

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Game({ params: paramsPromise }: Args) {
  try {
    const { isEnabled: draft } = await draftMode()
    const { slug = '' } = await paramsPromise
    const url = '/games/' + slug
    const game = await queryGameBySlug({ slug })

    if (!game) return <PayloadRedirects url={url} />

    const relatedReviews =
      game.genres && Array.isArray(game.genres) && game.genres.length > 0
        ? await queryRelatedReviews({ genres: game.genres })
        : []

    return (
      <article className="pb-16">
        <PageClient />

        <PayloadRedirects disableNotFound url={url} />

        {draft && <LivePreviewListener />}

        <GameHero game={game} />

        <div className="container max-w-4xl mx-auto pt-16 pb-8">
          {/* Synopsis Section */}
          {game.synopsis && (
            <div className="mb-12 p-6 bg-card border border-border rounded-lg">
              <p className="text-lg text-foreground leading-relaxed">{game.synopsis}</p>
            </div>
          )}

          {/* Main Info Section */}
          <div className="space-y-12">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {game.releaseDate && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-brand uppercase tracking-wider">
                    Release Date
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {format(new Date(game.releaseDate), 'MMM dd')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(game.releaseDate), 'yyyy')}
                  </p>
                </div>
              )}

              {game.developer && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-brand uppercase tracking-wider">
                    Developer
                  </p>
                  <p className="text-sm font-bold text-foreground line-clamp-2">{game.developer}</p>
                </div>
              )}

              {game.publisher && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-brand uppercase tracking-wider">
                    Publisher
                  </p>
                  <p className="text-sm font-bold text-foreground line-clamp-2">{game.publisher}</p>
                </div>
              )}

              {game.length && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-brand uppercase tracking-wider">
                    Length
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {typeof game.length === 'object' ? game.length.label : game.length}
                  </p>
                </div>
              )}
            </div>

            {/* Screenshots Gallery */}
            {game.screenshots && Array.isArray(game.screenshots) && game.screenshots.length > 0 && (
              <div className="space-y-6">
                <GameScreenshots screenshots={game.screenshots} gameTitle={game.title} />
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Platforms Section */}
            {game.platforms && game.platforms.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-brand" />
                  <h3 className="text-sm font-bold text-brand uppercase tracking-wider">
                    Available On
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {game.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="px-4 py-2 bg-card border border-brand/20 rounded-lg text-sm font-semibold text-foreground hover:border-brand/60 hover:bg-brand/5 transition-all"
                    >
                      {platformLabels[platform] || platform}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Genres Section */}
            {game.genres && Array.isArray(game.genres) && game.genres.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-brand" />
                  <h3 className="text-sm font-bold text-brand uppercase tracking-wider">Genres</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {game.genres.map((genre) => {
                    if (
                      typeof genre === 'object' &&
                      genre !== null &&
                      'id' in genre &&
                      'name' in genre
                    ) {
                      return (
                        <span
                          key={genre.id}
                          className="px-3 py-1.5 bg-brand/10 border border-brand/20 text-foreground rounded-full text-sm font-medium hover:bg-brand/20 transition-colors"
                        >
                          {genre.name}
                        </span>
                      )
                    }
                    return null
                  })}
                </div>
              </div>
            )}

            {/* Narrative Tags Section */}
            {game.narrativeTags &&
              Array.isArray(game.narrativeTags) &&
              game.narrativeTags.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-brand uppercase tracking-wider">
                    Narrative Themes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {game.narrativeTags.map((tag) => {
                      if (typeof tag === 'object' && tag !== null && 'id' in tag && 'name' in tag) {
                        return (
                          <span
                            key={tag.id}
                            className="px-3 py-1.5 bg-brand/10 border border-brand/20 text-foreground rounded-full text-xs font-medium"
                          >
                            {tag.name}
                          </span>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>
              )}

            {/* Related Games Section */}
            {game.relatedGames &&
              Array.isArray(game.relatedGames) &&
              game.relatedGames.length > 0 && (
                <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="h-1 w-12 rounded-full bg-brand" />
                      <h2 className="text-3xl font-bold text-foreground">Similar Games</h2>
                    </div>
                    <p className="text-muted-foreground ml-16">You might also enjoy these games</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                    {game.relatedGames.map((relatedGame, index) => {
                      if (typeof relatedGame === 'string') return null
                      return (
                        <article
                          key={index}
                          className="border border-border rounded-xl overflow-hidden bg-card hover:cursor-pointer transition-all duration-300 hover:border-brand/60 hover:shadow-lg hover:-translate-y-1"
                        >
                          <div className="relative w-full h-48 overflow-hidden bg-muted">
                            {relatedGame.coverImage &&
                              typeof relatedGame.coverImage !== 'string' && (
                                <img
                                  src={relatedGame.coverImage.url || '/assets/placeholder.webp'}
                                  alt={relatedGame.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              )}
                          </div>
                          <div className="p-4 space-y-3">
                            <a href={`/games/${relatedGame.slug}`} className="group/link">
                              <h3 className="font-bold text-lg text-foreground group-hover/link:text-brand transition-colors line-clamp-2">
                                {relatedGame.title}
                              </h3>
                            </a>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </div>
              )}

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Related Reviews Section */}
            {relatedReviews && relatedReviews.length > 0 && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="h-1 w-12 rounded-full bg-brand" />
                    <h2 className="text-3xl font-bold text-foreground">Expert Reviews</h2>
                  </div>
                  <p className="text-muted-foreground ml-16">
                    Read what critics say about {game.title}
                  </p>
                </div>
                <RelatedReviews
                  className="max-w-full"
                  docs={relatedReviews.filter((review) => typeof review === 'object') as any}
                />
              </div>
            )}
          </div>
        </div>
      </article>
    )
  } catch (error) {
    console.error('Error rendering game page:', error)
    return <PayloadRedirects url={'/games'} />
  }
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const game = await queryGameBySlug({ slug })

  return generateMeta({ doc: game })
}

const queryGameBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'games',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    select: {
      id: true,
      title: true,
      slug: true,
      releaseDate: true,
      developer: true,
      publisher: true,
      platforms: true,
      coverImage: true,
      screenshots: true,
      genres: true,
      narrativeTags: true,
      length: true,
      synopsis: true,
      relatedGames: true,
      meta: true,
    },
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

const queryRelatedReviews = cache(async ({ genres }: { genres: (string | { id: string })[] }) => {
  const payload = await getPayload({ config: configPromise })

  if (!genres || genres.length === 0) return []

  const genreIds = genres
    .map((g) => (typeof g === 'object' && g !== null ? g.id : g))
    .filter(Boolean)

  if (genreIds.length === 0) return []

  const reviews = await payload.find({
    collection: 'reviews',
    draft: false,
    limit: 6,
    overrideAccess: false,
    pagination: false,
    where: {
      and: [
        {
          'game.genres': {
            in: genreIds,
          },
        },
      ],
    },
    select: {
      title: true,
      slug: true,
      meta: true,
      categories: true,
    },
  })

  return reviews.docs
})
