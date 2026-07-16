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
    <section className="space-y-4">
      <Header title={title} description={description} link={link} />

      <div className="divide-y-2 divide-border">
        {reviews.map((r) => (
          <TopReviewItem key={r.id} {...r} />
        ))}
      </div>
    </section>
  )
}
