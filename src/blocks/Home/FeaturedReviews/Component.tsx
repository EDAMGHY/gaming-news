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
    <section className="container py-16 lg:py-20">
      {(title || description || link) && (
        <header className="mb-10 flex items-start justify-between gap-6 pb-8 border-b-2 border-brand/20">
          <div className="space-y-3 flex-1">
            {title && <h2 className="text-4xl lg:text-5xl font-bold text-foreground flex items-center gap-3"><span className="h-12 w-1 rounded-full bg-brand" />{title}</h2>}
            {description && <p className="mt-2 text-muted-foreground max-w-2xl ml-4">{description}</p>}
          </div>
          {link && (
            <Button className="shrink-0 bg-brand hover:bg-brand/90 text-white font-semibold px-6 py-2 rounded-lg transition-all hover:shadow-lg" asChild>
              <Link href={link}>View all</Link>
            </Button>
          )}
        </header>
      )}

      <div className="grid grid-cols-1 gap-3">
        {docs.map((r) => (
          <FeaturedReview key={r.id} {...r} />
        ))}
      </div>
    </section>
  )
}
