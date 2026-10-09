import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import { CallToActionBlock, type LibraryStats } from './Component'

/** Live library counts: each one is a "save slot" in its content type's glyph color. */
const getLibraryStats = async (): Promise<LibraryStats> => {
  const payload = await getPayload({ config: configPromise })
  const published = { _status: { equals: 'published' } } as const

  const [articles, reviews, games, latest] = await Promise.all([
    payload.count({ collection: 'articles', where: published }),
    payload.count({ collection: 'reviews', where: published }),
    payload.count({ collection: 'games', where: published }),
    payload.find({
      collection: 'articles',
      depth: 0,
      limit: 1,
      select: { publishedAt: true },
      sort: '-publishedAt',
      where: published,
    }),
  ])

  return {
    lastSaved: latest.docs[0]?.publishedAt ?? null,
    slots: [
      { count: articles.totalDocs, glyph: 'bg-glyph-news', href: '/articles', label: 'Stories' },
      { count: reviews.totalDocs, glyph: 'bg-glyph-review', href: '/reviews', label: 'Reviews' },
      { count: games.totalDocs, glyph: 'bg-glyph-game', href: '/games', label: 'Games' },
    ],
  }
}

export const CallToActionWithStats: React.FC<CTABlockProps> = async (props) => {
  const stats = await getLibraryStats()
  return <CallToActionBlock {...props} stats={stats} />
}
