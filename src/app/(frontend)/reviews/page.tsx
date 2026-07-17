import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { siteConfig } from '@/config/site'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const reviews = await payload.find({
    collection: 'reviews',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className="">
      <PageClient />
      <div className="bg-gradient-to-br from-brand/10 via-brand/5 to-transparent border-b border-brand/20 py-16 mb-16">
        <div className="container">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="h-1 w-12 rounded-full bg-brand" />
              <p className="text-brand font-semibold uppercase text-sm tracking-wide">Critical Analysis</p>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground">Game Reviews</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">Expert reviews with detailed scores, pros, cons, and honest verdicts on the latest games.</p>
          </div>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="reviews"
          currentPage={reviews.page}
          limit={12}
          totalDocs={reviews.totalDocs}
        />
      </div>

      <CollectionArchive reviews={reviews.docs} />

      <div className="container">
        {reviews.totalPages > 1 && reviews.page && (
          <Pagination page={reviews.page} totalPages={reviews.totalPages} />
        )}
      </div>
      <div className="pb-24" />
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Reviews | ${siteConfig.name}`,
    description: 'Read our latest game reviews with detailed scores, pros, and cons.',
    openGraph: mergeOpenGraph({
      title: `Reviews | ${siteConfig.name}`,
      description: 'Read our latest game reviews with detailed scores, pros, and cons.',
      url: `${getServerSideURL()}/reviews`,
    }),
  }
}
