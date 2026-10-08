import React from 'react'
import type { ITopReviewsBlock } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { TopReviewItem } from './TopReviewItem'
import { ContentSectionHeader } from '@/components/ContentSectionHeader'

export const TopReviewsBlock: React.FC<ITopReviewsBlock> = async ({
  title,
  description,
  link,
  limit = 6,
  minRating = 2,
}) => {
  const payload = await getPayload({ config: configPromise })

  const res = await payload.find({
    collection: 'reviews',
    depth: 2,
    limit: limit!,
    sort: '-rating', // top rating first
    where: {
      _status: { equals: 'published' }, // optional; access might already handle this
      rating: { greater_than_equal: minRating },
    },
  })

  const reviews = res?.docs || []

  if (reviews.length === 0) return null

  return (
    <section className="container py-6 lg:py-12">
      <ContentSectionHeader
        actionHref={link}
        description={description}
        eyebrow="Scoreboard"
        title={title || 'Top rated reviews'}
      />

      <div className="divide-y divide-border border-y border-border">
        {reviews.map((r, index) => (
          <TopReviewItem key={r.id} rank={index + 1} {...r} />
        ))}
      </div>
    </section>
  )
}
