import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Review } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'
import { Badge } from '@/components/ui/badge'
import { getGameCover } from '@/utilities/gameMedia'

export const ReviewHero: React.FC<{
  review: Review
}> = ({ review }) => {
  const { categories, game, heroImage, populatedAuthors, publishedAt, title, rating } = review
  const gameTitle = typeof game === 'object' ? game.title : undefined
  const image =
    (heroImage && typeof heroImage !== 'string' ? heroImage : undefined) ||
    (typeof game === 'object' ? getGameCover(game) : undefined)
  const hasRating = rating !== null && rating !== undefined
  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <div className="relative">
      {/* Full-width hero image */}
      <div className="relative h-[68vh] min-h-[34rem] w-full overflow-hidden group md:h-[78vh]">
        {image && (
          <Media
            fill
            priority
            imgClassName="object-cover group-hover:scale-105 transition-transform duration-500"
            resource={image}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080c18] via-[#080c18]/55 to-black/20" />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
        <div className="container space-y-6 pb-10 text-white pointer-events-auto sm:pb-14">
          <div className="space-y-4">
            {/* Categories with brand styling */}
            {categories && categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {categories?.map((category, index) => {
                  if (typeof category === 'object' && category !== null) {
                    const { title: categoryTitle } = category
                    const titleToUse = categoryTitle || 'Untitled category'

                    return (
                      <Badge
                        key={index}
                        className="border-white/20 bg-white/10 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-white backdrop-blur hover:bg-white/10"
                      >
                        {titleToUse}
                      </Badge>
                    )
                  }
                  return null
                })}
              </div>
            )}

            {/* Title */}
            {gameTitle && (
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
                {gameTitle} review
              </p>
            )}
            <h1 className="max-w-5xl text-balance text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl md:text-6xl lg:text-7xl">
              {title}
            </h1>
          </div>

          {/* Metadata */}
          <div className="flex flex-col md:flex-row gap-8 text-sm md:text-base">
            {hasAuthors && (
              <div className="flex items-center gap-3 border-l-2 border-brand pl-4">
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wide">By</p>
                  <p className="font-semibold">{formatAuthors(populatedAuthors)}</p>
                </div>
              </div>
            )}
            {publishedAt && (
              <div className="flex items-center gap-3 border-l-2 border-brand pl-4">
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wide">Published</p>
                  <time dateTime={publishedAt} className="font-semibold">
                    {formatDateTime(publishedAt)}
                  </time>
                </div>
              </div>
            )}
            {hasRating && (
              <div className="flex items-center gap-3 border-l-2 border-brand pl-4">
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wide">Score</p>
                  <div className="flex items-end gap-2">
                    <span className="font-mono text-3xl font-bold leading-none text-brand">
                      {rating}
                    </span>
                    <span className="font-mono text-xs text-white/60">/ 5</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
