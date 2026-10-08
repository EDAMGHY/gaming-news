import React from 'react'

import type { IUpcomingGamesBlock } from '@/payload-types'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { resolveWindow } from '@/utilities/utils'
import { UpcomingGame } from './UpcomingGame'
import RichText from '@/components/RichText'
import { ContentSectionHeader } from '@/components/ContentSectionHeader'

export const UpcomingGamesBlock: React.FC<IUpcomingGamesBlock> = async (block) => {
  const payload = await getPayload({ config: configPromise })
  const limit = block.limit ?? 6

  const { start, end } = resolveWindow(block)

  const res = await payload.find({
    collection: 'games',
    depth: 2,
    limit,
    sort: 'releaseDate',
    where: {
      _status: { equals: 'published' },
      and: [
        { releaseDate: { greater_than_equal: start.toISOString() } },
        { releaseDate: { less_than_equal: end.toISOString() } },
      ],
    },
  })

  let games = res?.docs || []

  // Fallback: if nothing falls inside the configured window, show the next
  // published games releasing from today onward so the section is never blank.
  if (games.length === 0) {
    const fallback = await payload.find({
      collection: 'games',
      depth: 2,
      limit,
      sort: 'releaseDate',
      where: {
        _status: { equals: 'published' },
        releaseDate: { greater_than_equal: new Date().toISOString() },
      },
    })
    games = fallback?.docs || []
  }

  if (games.length === 0) return null

  return (
    <section className="container py-6 lg:py-12">
      <ContentSectionHeader
        actionHref={block.link}
        actionLabel="Explore games"
        description={
          block.description ? (
            <RichText className="mb-0" data={block.description} enableGutter={false} />
          ) : undefined
        }
        eyebrow="Release rail"
        title={block.title || 'Next in the queue'}
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card/50">
        {games.map((game, index) => (
          <UpcomingGame key={game.id} game={game} index={index} />
        ))}
      </div>
    </section>
  )
}
