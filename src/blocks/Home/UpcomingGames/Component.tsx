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
    <div className="space-y-4">
      <Header title={block.title} description={block.description} link={block.link} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {games.map((game) => (
          <UpcomingGame key={game.id} game={game} />
        ))}
      </div>
    </div>
  )
}
