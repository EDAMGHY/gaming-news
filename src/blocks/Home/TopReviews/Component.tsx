import React from 'react'
import type { ITopReviewsBlock } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Header } from '@/components/Header/Header'
import { TopReviewItem } from './TopReviewItem'

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

  return (
    <section className="container py-6 lg:py-12">
      <div className="mb-10 pb-8 border-b-2 border-brand/20">
        <h2 className="text-4xl lg:text-5xl font-bold text-foreground flex items-center gap-3 mb-2">
          <span className="h-12 w-1 rounded-full bg-brand" />
          {title || 'Top Rated Reviews'}
        </h2>
        {description && <p className="text-muted-foreground max-w-2xl ml-4">{description}</p>}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {reviews.map((r) => (
          <TopReviewItem key={r.id} {...r} />
        ))}
      </div>
    </section>
  )
}
