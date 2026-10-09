import React from 'react'
import type { Review, IFeaturedReviewsBlock } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ReviewCard } from '@/components/ContentCard'
import { ContentSectionHeader } from '@/components/ContentSectionHeader'
import { Slider } from '@/components/Slider/Slider'

function isReview(v: Review | string | null | undefined): v is Review {
  return !!v && typeof v === 'object' && 'id' in v
}

export const FeaturedReviewsBlock: React.FC<IFeaturedReviewsBlock> = async ({
  title,
  description,
  link,
  reviews = [],
}) => {
  const ids = reviews?.filter((r): r is string => typeof r === 'string') || []
  let docs = reviews?.filter(isReview) || []

  // If Payload returned IDs, fetch full docs
  if (ids.length) {
    const payload = await getPayload({ config: configPromise })
    const res = await payload.find({
      collection: 'reviews',
      depth: 2,
      limit: ids.length,
      where: { id: { in: ids } },
    })

    const byId = new Map(res.docs.map((d) => [String(d.id), d]))
    docs = ids.map((id) => byId.get(String(id))).filter(Boolean) as Review[]
  }

  if (docs.length === 0) return null

  return (
    <section className="container py-6 lg:py-12">
      <ContentSectionHeader
        actionHref={link}
        description={description}
        eyebrow="Tested, finished, scored"
        title={title || 'Featured reviews'}
      />

      {/* Offset from Featured Stories' 8s autoplay so the two rows don't advance in lockstep */}
      <Slider autoplay={9000} label={title || 'Featured reviews'} size="card">
        {docs.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </Slider>
    </section>
  )
}
