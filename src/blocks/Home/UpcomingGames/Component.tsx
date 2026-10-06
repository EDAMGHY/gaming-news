import React from 'react'

import type { IUpcomingGamesBlock } from '@/payload-types'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { resolveWindow } from '@/utilities/utils'
import { UpcomingGame } from './UpcomingGame'
import RichText from '@/components/RichText'

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

  return (
    <section className="container py-6 lg:py-12">
      <div className="mb-10 pb-8 border-b-2 border-brand/20">
        <h2 className="text-4xl lg:text-5xl font-bold text-foreground flex items-center gap-3 mb-2">
          <span className="h-12 w-1 rounded-full bg-brand" />
          {block.title || 'Upcoming Releases'}
        </h2>
        {block.description && (
          <RichText
            className="text-muted-foreground max-w-2xl ml-4"
            data={block.description}
            enableGutter={false}
          />
        )}
      </div>

      <div className="grid grid-flow-dense grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[14rem] lg:auto-rows-[15rem] gap-6">
        {games.map((game, index) => (
          <UpcomingGame
            key={game.id}
            game={game}
            featured={index % 6 === 0 || index % 6 === 4}
          />
        ))}
      </div>
    </section>
  )
}
