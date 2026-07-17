import React from 'react'

import type { Article } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'
import { formatRelativeDate } from '@/utilities/date'

export const ArticleHero: React.FC<{
  article: Article
}> = ({ article }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title } = article

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <div className="relative">
      {/* Full-width hero image */}
      <div className="w-full h-[70vh] md:h-[85vh] relative overflow-hidden group">
        {heroImage && typeof heroImage !== 'string' && (
          <Media fill priority imgClassName="-z-10 object-cover group-hover:scale-105 transition-transform duration-500" resource={heroImage} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
        <div className="container pb-16 text-white space-y-6 pointer-events-auto">
          <div className="space-y-4">
            {/* Categories with brand styling */}
            {categories && categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {categories?.map((category, index) => {
                  if (typeof category === 'object' && category !== null) {
                    const { title: categoryTitle } = category
                    const titleToUse = categoryTitle || 'Untitled category'

                    return (
                      <span key={index} className="inline-block bg-brand text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {titleToUse}
                      </span>
                    )
                  }
                  return null
                })}
              </div>
            )}

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">{title}</h1>
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
                  <time dateTime={publishedAt} className="font-semibold">{formatRelativeDate(publishedAt)}</time>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
