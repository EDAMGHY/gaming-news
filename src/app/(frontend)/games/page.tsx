import type { Metadata } from 'next/types'
import type { Where } from 'payload'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { QueryPagination } from '@/components/Pagination/QueryPagination'
import { GamesSearchAndFilter } from '@/components/SearchAndFilters/GamesSearchAndFilter'
import { siteConfig } from '@/config/site'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'

const GAMES_PER_PAGE = 12

const PLATFORM_LABELS: Record<string, string> = {
  pc: 'PC',
  ps5: 'PS5',
  ps4: 'PS4',
  'xbox-series': 'Xbox Series',
  'xbox-one': 'Xbox One',
  switch: 'Nintendo Switch',
  'switch-2': 'Nintendo Switch 2',
  mobile: 'Mobile',
}

type Args = {
  searchParams: Promise<{
    page?: string
    search?: string
    platform?: string | string[]
    genre?: string | string[]
    tag?: string | string[]
  }>
}

const toArray = (value?: string | string[]): string[] =>
  Array.isArray(value) ? value : value ? [value] : []

export default async function Page({ searchParams }: Args) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)
  const search = typeof params.search === 'string' ? params.search.trim() : ''
  const selectedPlatforms = toArray(params.platform)
  const selectedGenres = toArray(params.genre)
  const selectedNarrativeTags = toArray(params.tag)

  const payload = await getPayload({ config: configPromise })

  const where: Where = {}
  if (search) where.title = { like: search }
  if (selectedPlatforms.length > 0) where.platforms = { in: selectedPlatforms }
  if (selectedGenres.length > 0) where.genres = { in: selectedGenres }
  if (selectedNarrativeTags.length > 0) where.narrativeTags = { in: selectedNarrativeTags }

  const games = await payload.find({
    collection: 'games',
    depth: 1,
    limit: GAMES_PER_PAGE,
    page,
    where,
    overrideAccess: false,
  })

  // Facet query: derive the available filter options (with counts) from the full
  // collection so filters cover every game, not just the current page.
  const facetSource = await payload.find({
    collection: 'games',
    depth: 1,
    limit: 1000,
    pagination: false,
    overrideAccess: false,
    select: { platforms: true, genres: true, narrativeTags: true },
  })

  const platformMap = new Map<string, { label: string; count: number }>()
  const genreMap = new Map<string, { name: string; count: number }>()
  const tagMap = new Map<string, { name: string; count: number }>()

  facetSource.docs.forEach((game: any) => {
    ;(game.platforms as string[] | undefined)?.forEach((value) => {
      const existing = platformMap.get(value)
      platformMap.set(value, {
        label: PLATFORM_LABELS[value] || value,
        count: (existing?.count || 0) + 1,
      })
    })
    ;(game.genres as Array<string | { id: string; name?: string }> | undefined)?.forEach((genre) => {
      const id = typeof genre === 'string' ? genre : genre.id
      const name = typeof genre === 'string' ? genre : genre.name || genre.id
      const existing = genreMap.get(id)
      genreMap.set(id, { name, count: (existing?.count || 0) + 1 })
    })
    ;(game.narrativeTags as Array<string | { id: string; name?: string }> | undefined)?.forEach(
      (tag) => {
        const id = typeof tag === 'string' ? tag : tag.id
        const name = typeof tag === 'string' ? tag : tag.name || tag.id
        const existing = tagMap.get(id)
        tagMap.set(id, { name, count: (existing?.count || 0) + 1 })
      },
    )
  })

  const platformOptions = Array.from(platformMap.entries()).map(([value, { label, count }]) => ({
    value,
    label,
    count,
  }))
  const genreOptions = Array.from(genreMap.entries()).map(([id, { name, count }]) => ({
    id,
    name,
    count,
  }))
  const narrativeTagOptions = Array.from(tagMap.entries()).map(([id, { name, count }]) => ({
    id,
    name,
    count,
  }))

  return (
    <div className="">
      <PageClient />
      <div className="bg-gradient-to-br from-brand/10 via-brand/5 to-transparent border-b border-brand/20 py-16 mb-16">
        <div className="container">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="h-1 w-12 rounded-full bg-brand" />
              <p className="text-brand font-semibold uppercase text-sm tracking-wide">
                Game Database
              </p>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground">Games Catalogue</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore our comprehensive game database with detailed information, platforms, and
              release dates.
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <GamesSearchAndFilter
          platforms={platformOptions}
          genres={genreOptions}
          narrativeTags={narrativeTagOptions}
        />

        <div className="text-sm text-muted-foreground mb-6">
          Showing {games.docs.length} of {games.totalDocs} games
        </div>

        {games.docs.length > 0 ? (
          <>
            <div className="mb-8">
              <PageRange
                collection="games"
                currentPage={games.page}
                limit={GAMES_PER_PAGE}
                totalDocs={games.totalDocs}
              />
            </div>

            <CollectionArchive games={games.docs as any} />

            {games.totalPages > 1 && games.page && (
              <QueryPagination page={games.page} totalPages={games.totalPages} />
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No games found matching your criteria.</p>
          </div>
        )}
      </div>

      <div className="pb-24" />
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Games | ${siteConfig.name}`,
    description:
      'Explore our comprehensive game database with reviews, releases, platforms, and more.',
    openGraph: mergeOpenGraph({
      title: `Games | ${siteConfig.name}`,
      description:
        'Explore our comprehensive game database with reviews, releases, platforms, and more.',
      url: `${getServerSideURL()}/games`,
    }),
  }
}
