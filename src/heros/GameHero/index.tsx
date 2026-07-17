import React from 'react'

import type { Game } from '@/payload-types'

import { Media } from '@/components/Media'
import { format } from 'date-fns'
import { Gamepad2 } from 'lucide-react'

const platformLabels: Record<string, string> = {
  pc: 'PC',
  ps5: 'PlayStation 5',
  ps4: 'PlayStation 4',
  'xbox-series': 'Xbox Series X|S',
  'xbox-one': 'Xbox One',
  switch: 'Nintendo Switch',
  'switch-2': 'Nintendo Switch 2',
  mobile: 'Mobile',
}

export const GameHero: React.FC<{
  game: Game
}> = ({ game }) => {
  const { coverImage, releaseDate, title, platforms, developer, publisher } = game

  return (
    <div className="relative">
      {/* Full-width hero image */}
      <div className="w-full h-[70vh] md:h-[85vh] relative overflow-hidden group">
        {coverImage && typeof coverImage !== 'string' && (
          <Media fill priority imgClassName="-z-10 object-cover group-hover:scale-105 transition-transform duration-500" resource={coverImage} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
        <div className="container pb-16 text-white space-y-6 pointer-events-auto">
          <div className="space-y-2">
            {/* Category badge */}
            <span className="inline-block bg-brand text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Game
            </span>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">{title}</h1>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pt-4">
            {releaseDate && (
              <div className="border-l-2 border-brand pl-4">
                <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Release Date</p>
                <time dateTime={releaseDate} className="text-lg font-semibold">
                  {format(new Date(releaseDate), 'PPP')}
                </time>
              </div>
            )}
            {platforms && platforms.length > 0 && (
              <div className="border-l-2 border-brand pl-4">
                <p className="text-white/70 text-xs uppercase tracking-wide mb-2">Platforms</p>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((platform) => (
                    <span
                      key={platform}
                      className="inline-flex items-center gap-1 bg-white/10 hover:bg-brand/80 transition-colors text-white rounded px-2.5 py-1 text-xs font-semibold"
                    >
                      <Gamepad2 className="w-3 h-3" />
                      {platformLabels[platform] || platform}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {(developer || publisher) && (
              <div className="border-l-2 border-brand pl-4">
                <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Developer</p>
                <p className="text-lg font-semibold">{[developer, publisher].filter(Boolean).join(' / ')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
