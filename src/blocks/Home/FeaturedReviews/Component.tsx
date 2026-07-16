import React from 'react'
import type { Review, IFeaturedReviewsBlock } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FeaturedReview } from './FeaturedReview'

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

  return (
    <section className="container py-10">
      {(title || description || link) && (
        <header className="mb-6 flex items-end justify-between gap-6">
          <div className="space-y-2">
            {title && <h2 className="text-3xl font-semibold">{title}</h2>}
            {description && <p className="mt-2 text-muted-foreground">{description}</p>}
          </div>
          {link && (
            <Button variant="primary" asChild>
              <Link href={link}>View all</Link>
            </Button>
          )}
        </header>
      )}

      <div className="divide-y divide-border grid grid-cols-1 gap-4">
        {docs.map((r) => (
          <FeaturedReview key={r.id} {...r} />
        ))}
      </div>
    </section>
  )
}
