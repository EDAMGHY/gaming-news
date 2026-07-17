import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'
import { siteConfig } from '@/config/site'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const reviews = await payload.find({
    collection: 'reviews',
    depth: 1,
    limit: 12,
    page: sanitizedPageNumber,
    overrideAccess: false,
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
        {reviews?.page && reviews?.totalPages > 1 && (
          <Pagination page={reviews.page} totalPages={reviews.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Reviews - Page ${pageNumber || ''} | ${siteConfig.name}`,
    description: 'Read our latest game reviews with detailed scores, pros, and cons.',
    openGraph: mergeOpenGraph({
      title: `Reviews - Page ${pageNumber || ''} | ${siteConfig.name}`,
      description: 'Read our latest game reviews with detailed scores, pros, and cons.',
      url: `${getServerSideURL()}/reviews/page/${pageNumber}`,
    }),
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'reviews',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / 10)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
