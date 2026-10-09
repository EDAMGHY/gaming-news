import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ArrowUpRight } from 'lucide-react'

import type { Category, Genre, ICategoryBrowseBlock } from '@/payload-types'
import { ContentSectionHeader } from '@/components/ContentSectionHeader'
import { Media } from '@/components/Media'
import { getGameCover, type GameImageSource } from '@/utilities/gameMedia'
import { cn } from '@/utilities/ui'

type GenreTile = {
  count: number
  id: string
  image?: GameImageSource
  name: string
}

type TopicEntry = {
  count: number
  id: string
  title: string
}

/** Genres in the big art tiles; everything after is listed as text. */
const TILE_COUNT = 5

const relationId = (value: unknown): string | null => {
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null && 'id' in value) return String(value.id)
  return null
}

const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`

export const CategoryBrowseBlock: React.FC<ICategoryBrowseBlock> = async ({
  title,
  description,
}) => {
  const payload = await getPayload({ config: configPromise })

  const [genresRes, categoriesRes, gamesRes, articlesRes] = await Promise.all([
    payload.find({ collection: 'genres', depth: 0, limit: 100, pagination: false }),
    payload.find({ collection: 'categories', depth: 0, limit: 100, pagination: false }),
    payload.find({
      collection: 'games',
      depth: 1,
      limit: 500,
      pagination: false,
      select: { coverImage: true, externalCoverUrl: true, genres: true, title: true },
    }),
    payload.find({
      collection: 'articles',
      depth: 0,
      limit: 1000,
      pagination: false,
      select: { categories: true },
    }),
  ])

  // Rank genres by how many games they hold; size on the page follows depth of catalogue.
  const gamesByGenre = new Map<string, typeof gamesRes.docs>()
  for (const game of gamesRes.docs) {
    for (const genre of game.genres ?? []) {
      const id = relationId(genre)
      if (!id) continue
      gamesByGenre.set(id, [...(gamesByGenre.get(id) ?? []), game])
    }
  }

  const usedArt = new Set<string>()
  const genres: GenreTile[] = genresRes.docs
    .map((genre: Genre) => ({
      count: gamesByGenre.get(String(genre.id))?.length ?? 0,
      id: String(genre.id),
      name: genre.name,
    }))
    .filter((genre) => genre.count > 0)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .map((genre, index) => {
      if (index >= TILE_COUNT) return genre
      // Prefer a cover not already shown in another tile.
      const candidates = (gamesByGenre.get(genre.id) ?? []).filter((game) => getGameCover(game))
      const pick = candidates.find((game) => !usedArt.has(String(game.id))) ?? candidates[0]
      if (pick) usedArt.add(String(pick.id))
      return { ...genre, image: pick ? getGameCover(pick) : undefined }
    })

  const articlesByCategory = new Map<string, number>()
  for (const article of articlesRes.docs) {
    for (const category of article.categories ?? []) {
      const id = relationId(category)
      if (id) articlesByCategory.set(id, (articlesByCategory.get(id) ?? 0) + 1)
    }
  }

  const topics: TopicEntry[] = categoriesRes.docs
    .map((category: Category) => ({
      count: articlesByCategory.get(String(category.id)) ?? 0,
      id: String(category.id),
      title: category.title,
    }))
    .filter((topic) => topic.count > 0)
    .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title))

  if (genres.length === 0 && topics.length === 0) return null

  const tiles = genres.slice(0, TILE_COUNT)
  const moreGenres = genres.slice(TILE_COUNT)
  const hasFeature = tiles.length >= TILE_COUNT

  return (
    <section className="container py-6 lg:py-12">
      <ContentSectionHeader
        actionHref="/games"
        actionLabel="All games"
        description={description}
        eyebrow="Discovery"
        title={title || 'Browse by category'}
      />

      {tiles.length > 0 && (
        <ul
          className={cn(
            'grid auto-rows-[9.5rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] md:grid-cols-4',
            hasFeature && 'md:grid-rows-[11rem_11rem]',
          )}
        >
          {tiles.map((genre, index) => {
            const isFeature = hasFeature && index === 0

            return (
              <li
                className={cn(isFeature && 'col-span-2 row-span-2 md:col-span-2')}
                key={genre.id}
              >
                <Link
                  className="group relative flex h-full flex-col justify-end overflow-hidden rounded-lg border border-border bg-ink text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  href={`/games?genre=${genre.id}`}
                >
                  {genre.image && (
                    <Media
                      alt=""
                      fill
                      imgClassName="object-cover opacity-70 transition-[transform,opacity] duration-500 ease-out group-hover:scale-[1.04] group-hover:opacity-90"
                      resource={genre.image}
                      size={
                        isFeature
                          ? '(max-width: 767px) 100vw, 50vw'
                          : '(max-width: 767px) 50vw, 25vw'
                      }
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/5"
                  />

                  <span className="relative flex items-end justify-between gap-3 p-4 sm:p-5">
                    <span className="min-w-0">
                      <span className="mb-1.5 flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-white/70">
                        <span aria-hidden="true" className="size-1.5 rounded-full bg-glyph-game" />
                        {pluralize(genre.count, 'game')}
                      </span>
                      <span
                        className={cn(
                          'block font-display font-black uppercase leading-[0.9] tracking-[-0.01em]',
                          isFeature
                            ? 'text-[2.6rem] sm:text-6xl lg:text-7xl'
                            : 'text-xl sm:text-2xl',
                        )}
                        style={{ fontStretch: '78%' }}
                      >
                        {genre.name}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="mb-1 size-5 shrink-0 text-white/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                    />
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      {(moreGenres.length > 0 || topics.length > 0) && (
        <div className="mt-3 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-[1.6fr_1fr]">
          {moreGenres.length > 0 && (
            <nav aria-label="More genres" className="bg-card p-5 sm:p-6">
              <h3 className="mb-4 font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Also in the library
              </h3>
              <ul className="flex flex-wrap gap-x-5 gap-y-2.5">
                {moreGenres.map((genre) => (
                  <li key={genre.id}>
                    <Link
                      className="group inline-flex items-baseline gap-1.5 font-semibold transition-colors hover:text-glyph-game focus:outline-none focus-visible:underline"
                      href={`/games?genre=${genre.id}`}
                    >
                      {genre.name}
                      <span className="font-mono text-[0.68rem] font-normal text-muted-foreground group-hover:text-glyph-game">
                        {genre.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {topics.length > 0 && (
            <nav
              aria-label="Article topics"
              className={cn('bg-card p-5 sm:p-6', moreGenres.length === 0 && 'md:col-span-2')}
            >
              <h3 className="mb-3 font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Read by topic
              </h3>
              <ul className="divide-y divide-border">
                {topics.map((topic) => (
                  <li key={topic.id}>
                    <Link
                      className="group flex items-center gap-3 py-2.5 font-semibold transition-colors hover:text-brand focus:outline-none focus-visible:text-brand"
                      href={`/articles?category=${topic.id}`}
                    >
                      <span aria-hidden="true" className="size-2 rounded-full bg-glyph-news" />
                      <span className="flex-1">{topic.title}</span>
                      <span className="font-mono text-xs font-normal text-muted-foreground">
                        {pluralize(topic.count, 'story', 'stories')}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      )}
    </section>
  )
}
