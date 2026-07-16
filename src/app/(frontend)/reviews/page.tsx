import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

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
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Reviews</h1>
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
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Reviews`,
  }
}
