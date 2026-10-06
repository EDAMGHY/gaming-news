import { Media } from '@/components/Media'
import { Game } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { format } from 'date-fns'
import { Calendar } from 'lucide-react'
import React from 'react'
import Link from 'next/link'

export const UpcomingGame: React.FC<{ game: Game; featured?: boolean }> = ({ game, featured }) => {
  return (
    <Link
      href={`/games/${game.slug}`}
      className={cn(
        'group relative block h-full overflow-hidden rounded-lg border border-brand/20 transition-all hover:border-brand/60 hover:shadow-xl hover:-translate-y-1',
        // Featured tiles take two columns / two rows where the grid allows it.
        featured ? 'sm:col-span-2 sm:row-span-2' : 'col-span-1 row-span-1',
      )}
    >
      <Media
        className="h-full w-full shrink-0"
        fill
        pictureClassName="relative block h-full w-full group-hover:scale-105 transition-transform duration-300"
        imgClassName="object-cover"
        resource={game.coverImage}
        size={featured ? '66vw' : '33vw'}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
      <div className="absolute bottom-0 left-0 right-0 space-y-2 p-4 text-white lg:p-5">
        <h3
          className={cn(
            'font-bold line-clamp-2 group-hover:text-brand transition-colors',
            featured ? 'text-xl lg:text-3xl' : 'text-lg',
          )}
        >
          {game.title}
        </h3>
        {game.releaseDate && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={16} className="text-brand flex-shrink-0" />
            <time dateTime={game.releaseDate} className="text-white/90">
              {format(new Date(game.releaseDate), 'PPP')}
            </time>
          </div>
        )}
      </div>
    </Link>
  )
}
