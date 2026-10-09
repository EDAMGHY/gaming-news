import { Media } from '@/components/Media'
import { Game } from '@/payload-types'
import { format } from 'date-fns'
import { ArrowUpRight } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { getGameCover } from '@/utilities/gameMedia'

const platformLabels: Record<string, string> = {
  pc: 'PC',
  ps5: 'PS5',
  ps4: 'PS4',
  'xbox-series': 'Xbox Series',
  'xbox-one': 'Xbox One',
  switch: 'Switch',
  'switch-2': 'Switch 2',
  mobile: 'Mobile',
}

export const UpcomingGame: React.FC<{ game: Game; index: number }> = ({ game, index }) => {
  const coverImage = getGameCover(game)

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group grid grid-cols-[4.25rem_1fr_auto] items-center gap-4 border-b border-border p-3 transition-colors last:border-b-0 hover:bg-brand/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand sm:grid-cols-[5.5rem_7rem_1fr_auto] sm:gap-6 sm:p-4"
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
        <Media
          fill
          imgClassName="object-cover transition-transform duration-300 group-hover:scale-105"
          resource={coverImage}
          size="88px"
        />
      </div>
      <div className="hidden font-mono sm:block">
        <span className="block text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
          Slot {String(index + 1).padStart(2, '0')}
        </span>
        {game.releaseDate && (
          <time className="mt-1 block text-sm font-semibold" dateTime={game.releaseDate}>
            {format(new Date(game.releaseDate), 'MMM d')}
          </time>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="line-clamp-2 font-bold tracking-tight transition-colors group-hover:text-brand sm:text-lg">
          {game.title}
        </h3>
        <p className="mt-1 line-clamp-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
          {(game.platforms ?? [])
            .map((platform) => platformLabels[platform] ?? platform)
            .join(' · ') || 'Platform TBA'}
        </p>
      </div>
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
      />
    </Link>
  )
}
