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
import { ArrowLeft, Check, Clock3, Gamepad2, Info, Minus, Wrench } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const platformLabels: Record<string, string> = {
  pc: 'PC',
  ps5: 'PlayStation 5',
  ps4: 'PlayStation 4',
  'xbox-series': 'Xbox Series X|S',
  'xbox-one': 'Xbox One',
  switch: 'Nintendo Switch',
  'switch-2': 'Nintendo Switch 2',
  mobile: 'Mobile',
}

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

      <div className="mx-auto flex max-w-[52rem] flex-col items-center gap-8 px-4 pt-10 sm:px-6 md:pt-14">
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

        {(review.excerpt ||
          review.platformTested ||
          (review.hoursPlayed !== null && review.hoursPlayed !== undefined) ||
          review.testedVersion) && (
          <Card className="w-full overflow-hidden border-brand/30 bg-card shadow-none">
            {review.excerpt && (
              <CardHeader className="border-b border-border bg-brand/5">
                <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand">
                  Verdict
                </p>
                <CardTitle className="text-balance text-xl leading-8 sm:text-2xl">
                  {review.excerpt}
                </CardTitle>
              </CardHeader>
            )}
            {(review.platformTested ||
              (review.hoursPlayed !== null && review.hoursPlayed !== undefined) ||
              review.testedVersion) && (
              <CardContent className="grid gap-5 p-6 sm:grid-cols-3">
                {review.platformTested && (
                  <div>
                    <Gamepad2 aria-hidden="true" className="mb-2 size-4 text-brand" />
                    <p className="font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
                      Platform
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {platformLabels[review.platformTested] ?? review.platformTested}
                    </p>
                  </div>
                )}
                {review.hoursPlayed !== null && review.hoursPlayed !== undefined && (
                  <div>
                    <Clock3 aria-hidden="true" className="mb-2 size-4 text-brand" />
                    <p className="font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
                      Time played
                    </p>
                    <p className="mt-1 text-sm font-semibold">{review.hoursPlayed} hours</p>
                  </div>
                )}
                {review.testedVersion && (
                  <div>
                    <Wrench aria-hidden="true" className="mb-2 size-4 text-brand" />
                    <p className="font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
                      Version tested
                    </p>
                    <p className="mt-1 text-sm font-semibold">{review.testedVersion}</p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        )}

        {((review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0)) && (
          <div className="grid w-full gap-4 md:grid-cols-2">
            {review.pros && review.pros.length > 0 && (
              <Card className="border-emerald-500/30 bg-emerald-500/[0.04] shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Check aria-hidden="true" className="size-5 text-emerald-500" /> What works
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm leading-6">
                    {review.pros.map((pro) => (
                      <li className="flex gap-3" key={pro.id ?? pro.text}>
                        <span
                          aria-hidden="true"
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-500"
                        />
                        {pro.text}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            {review.cons && review.cons.length > 0 && (
              <Card className="border-amber-500/30 bg-amber-500/[0.04] shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Minus aria-hidden="true" className="size-5 text-amber-500" /> What misses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm leading-6">
                    {review.cons.map((con) => (
                      <li className="flex gap-3" key={con.id ?? con.text}>
                        <span
                          aria-hidden="true"
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500"
                        />
                        {con.text}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {review.disclosure && (
          <aside className="flex w-full gap-3 rounded-lg border border-border bg-muted/40 p-4 text-sm leading-6 text-muted-foreground">
            <Info aria-hidden="true" className="mt-1 size-4 shrink-0 text-brand" />
            <div>
              <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-foreground">
                Review disclosure
              </p>
              <p className="mt-1">{review.disclosure}</p>
            </div>
          </aside>
        )}

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
