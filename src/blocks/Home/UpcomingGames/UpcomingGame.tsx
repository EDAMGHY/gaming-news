import { Media } from '@/components/Media'
import { Game } from '@/payload-types'
import { format } from 'date-fns'
import { Calendar } from 'lucide-react'
import React from 'react'

export const UpcomingGame: React.FC<{ game: Game }> = ({ game }) => {
  return (
    <div key={game.id} className="relative overflow-hidden rounded-[8px] border">
      <Media
        className="w-full shrink-0 aspect-video"
        fill
        pictureClassName="relative w-full h-full block"
        resource={game.coverImage}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white space-y-1">
        <h3 className="text-lg font-semibold">{game.title}</h3>
        {game.releaseDate && (
          <span className="inline-flex items-center gap-2">
            <Calendar size={16} />
            <time dateTime={game.releaseDate} className="text-sm opacity-70">
              {format(new Date(game.releaseDate), 'PPP')}
            </time>
          </span>
        )}
      </div>
    </div>
  )
}
