import React from 'react'

import type { IUpcomingGamesBlock } from '@/payload-types'

import RichText from '@/components/RichText'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getPayload } from 'payload'
import { format } from 'date-fns'
import configPromise from '@payload-config'
import { resolveWindow } from '@/utilities/utils'
import { Header } from '@/components/Header/Header'
import { UpcomingGame } from './UpcomingGame'

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

  const games = res?.docs || []

  return (
    <section className="container py-6 lg:py-12">
      <div className="mb-10 pb-8 border-b-2 border-brand/20">
        <h2 className="text-4xl lg:text-5xl font-bold text-foreground flex items-center gap-3 mb-2">
          <span className="h-12 w-1 rounded-full bg-brand" />
          {block.title || 'Upcoming Releases'}
        </h2>
        {block.description && (
          <p className="text-muted-foreground max-w-2xl ml-4">{block.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <UpcomingGame key={game.id} game={game} />
        ))}
      </div>
    </section>
  )
}
