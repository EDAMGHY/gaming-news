import { Media } from '@/components/Media'
import { Game } from '@/payload-types'
import { format } from 'date-fns'
import { Calendar } from 'lucide-react'
import React from 'react'
import Link from 'next/link'

export const UpcomingGame: React.FC<{ game: Game }> = ({ game }) => {
  return (
    <Link href={`/games/${game.slug}`}>
      <div className="relative overflow-hidden rounded-lg border border-brand/20 group hover:border-brand/60 transition-all hover:shadow-xl hover:-translate-y-1">
        <Media
          className="w-full shrink-0 aspect-video"
          fill
          pictureClassName="relative w-full h-full block group-hover:scale-105 transition-transform duration-300"
          resource={game.coverImage}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white space-y-2">
          <h3 className="text-lg font-bold line-clamp-2 group-hover:text-brand transition-colors">{game.title}</h3>
          {game.releaseDate && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} className="text-brand flex-shrink-0" />
              <time dateTime={game.releaseDate} className="text-white/90">
                {format(new Date(game.releaseDate), 'PPP')}
              </time>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
