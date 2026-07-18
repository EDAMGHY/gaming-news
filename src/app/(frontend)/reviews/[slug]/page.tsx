import type { Metadata } from 'next'

import { RelatedReviews } from '@/blocks/RelatedReviews/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Review } from '@/payload-types'

import { ReviewHero } from '@/heros/ReviewHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const reviews = await payload.find({
    collection: 'reviews',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = reviews.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Review({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/reviews/' + slug
  const review = await queryReviewBySlug({ slug })

  if (!review) return <PayloadRedirects url={url} />
  return (
    <article className="pb-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <ReviewHero review={review} />

      <div className="max-w-[48rem] flex flex-col items-center gap-8 mx-auto pt-12">
        {/* Back to Listings */}
        <Link
          href="/reviews"
          className="group inline-flex items-center gap-2 self-start pl-2 pr-4 py-2 rounded-full border border-border bg-card text-sm font-semibold text-muted-foreground hover:text-brand hover:border-brand/50 hover:bg-brand/5 transition-all duration-300"
        >
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand/10 text-brand transition-transform duration-300 group-hover:-translate-x-0.5">
            <ArrowLeft className="w-4 h-4" />
          </span>
          Back to all reviews
        </Link>

        {/* Game Info Card - Simplified to avoid duplication */}
        {review.game && typeof review.game === 'object' && (
          <Link href={`/games/${review.game.slug}`}>
            <div className="w-full border border-brand/20 rounded-xl p-6 space-y-4 hover:bg-brand/5 hover:border-brand/60 transition-all group">
              <div className="flex gap-4 items-start">
                {review.game.meta?.image &&
                  typeof review.game.meta.image !== 'string' &&
                  review.game.meta.image.thumbnailURL && (
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={review.game.meta.image.thumbnailURL}
                        alt={`${review.game.title} cover`}
                        fill
                        className="rounded-lg object-cover group-hover:shadow-md transition-shadow"
                      />
                    </div>
                  )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground group-hover:text-brand transition-colors">
                    {review.game.title}
                  </h3>
                  <p className="text-xs text-brand font-semibold uppercase tracking-wide mt-1">
                    View Full Game Details →
                  </p>
                </div>
              </div>

              {review.game.meta?.description && (
                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {review.game.meta.description}
                  </p>
                </div>
              )}
            </div>
          </Link>
        )}

        {/* Review Content */}
        <RichText data={review.content} enableGutter={false} />
        {review.relatedReviews && review.relatedReviews.length > 0 && (
          <RelatedReviews
            className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
            docs={review.relatedReviews.filter((review) => typeof review === 'object')}
          />
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const review = await queryReviewBySlug({ slug })

  return generateMeta({ doc: review })
}

const queryReviewBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'reviews',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
