import type { Metadata } from 'next'

import { RelatedReviews } from '@/blocks/RelatedReviews/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Review } from '@/payload-types'
import { format } from 'date-fns'

import { ReviewHero } from '@/heros/ReviewHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Bookmark, Calendar, Gamepad2, Share2 } from 'lucide-react'
import { formatRelativeDate } from '@/utilities/date'

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

const platformLabels: Record<string, string> = {
  pc: 'PC',
  ps5: 'PlayStation 5',
  'xbox-series': 'Xbox Series X|S',
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
  console.log('gamegamegame', review.game)
  return (
    <article className="pt-16 pb-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <ReviewHero review={review} />

      {/* Floating Badge */}

      <div className="max-w-[48rem] flex flex-col items-center gap-4  mx-auto">
        {review.game && typeof review.game === 'object' && (
          <div className="border-x border-b border-border rounded-b-xl p-4 space-y-4">
            <div className="flex gap-5">
              <div className="relative w-24 h-24">
                <Image
                  src={review.game.meta.image.thumbnailURL}
                  alt={`${review.game.title} cover image`}
                  fill
                  className="rounded-full  object-cover"
                />
              </div>
              <div className="flex mt-4 gap-2">
                {review.game.releaseDate && (
                  <div>
                    <p className="text-slate-400 text-sm mb-3">Release Date</p>
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand-700" />
                      {format(new Date(review.game.releaseDate), 'PPP')}
                    </p>
                  </div>
                )}

                <div>
                  {review.game.platforms && review.game.platforms.length > 0 && (
                    <>
                      <p className="text-slate-400 text-sm mb-3">Platforms</p>
                      <div className="flex flex-wrap gap-2">
                        {review.game.platforms.map((platform) => (
                          <span
                            key={platform}
                            className="inline-flex items-center gap-2 dark:bg-slate-800 bg-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-medium dark:text-slate-200 text-slate-800  hover:border-brand-800/50 transition-colors"
                          >
                            <Gamepad2 className="w-4 h-4 text-brand-600" />
                            {platformLabels[platform]}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="pt-4">
              <p className="text-muted-foreground text-sm mb-2">About This Game</p>
              <p className="text-card-foreground text-sm leading-relaxed">
                {review.game.meta.description}
              </p>
            </div>
          </div>
        )}

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
