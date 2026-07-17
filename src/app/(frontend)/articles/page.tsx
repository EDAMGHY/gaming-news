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

  const articles = await payload.find({
    collection: 'articles',
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
              <p className="text-brand font-semibold uppercase text-sm tracking-wide">Insights & News</p>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground">Gaming Articles</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">Discover in-depth articles, industry news, and gaming insights from our expert writers.</p>
          </div>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="articles"
          currentPage={articles.page}
          limit={12}
          totalDocs={articles.totalDocs}
        />
      </div>

      <CollectionArchive articles={articles.docs} />

      <div className="container">
        {articles.totalPages > 1 && articles.page && (
          <Pagination page={articles.page} totalPages={articles.totalPages} />
        )}
      </div>
      <div className="pb-24" />
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Articles | ${siteConfig.name}`,
    description: 'Browse all gaming articles, news, and features.',
    openGraph: mergeOpenGraph({
      title: `Articles | ${siteConfig.name}`,
      description: 'Browse all gaming articles, news, and features.',
      url: `${getServerSideURL()}/articles`,
    }),
  }
}
