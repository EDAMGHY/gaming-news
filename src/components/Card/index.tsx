'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Article } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<Article, 'slug' | 'categories' | 'meta' | 'title'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'articles' | 'reviews' | 'games'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}
  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'border border-border rounded-xl overflow-hidden bg-card hover:cursor-pointer transition-all duration-300 hover:border-brand/60 hover:shadow-lg hover:-translate-y-1 group',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full h-48 overflow-hidden bg-muted">
        {!metaImage && <div className="flex items-center justify-center h-full text-muted-foreground">No image</div>}
        {metaImage && typeof metaImage !== 'string' && (
          <Media resource={metaImage} size="33vw" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        )}
      </div>
      <div className="p-4 space-y-3">
        {showCategories && hasCategories && (
          <div className="flex flex-wrap gap-2">
            {categories?.map((category, index) => {
              if (typeof category === 'object') {
                const { title: titleFromCategory } = category
                const categoryTitle = titleFromCategory || 'Untitled category'

                return (
                  <span key={index} className="inline-block bg-brand/20 text-brand text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                    {categoryTitle}
                  </span>
                )
              }
              return null
            })}
          </div>
        )}
        {titleToUse && (
          <div>
            <Link href={href} ref={link.ref} className="group/link">
              <h3 className="font-bold text-lg text-foreground group-hover/link:text-brand transition-colors line-clamp-2">
                {titleToUse}
              </h3>
            </Link>
          </div>
        )}
        {description && <p className="text-sm text-muted-foreground line-clamp-2">{sanitizedDescription}</p>}
      </div>
    </article>
  )
}
