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

  const games = await payload.find({
    collection: 'games',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
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
              <p className="text-brand font-semibold uppercase text-sm tracking-wide">
                Game Database
              </p>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground">Games Catalogue</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore our comprehensive game database with detailed information, platforms, and
              release dates.
            </p>
          </div>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="games"
          currentPage={games.page}
          limit={12}
          totalDocs={games.totalDocs}
        />
      </div>

      <CollectionArchive games={games.docs} />

      <div className="container">
        {games.totalPages > 1 && games.page && (
          <Pagination page={games.page} totalPages={games.totalPages} collection="games" />
        )}
      </div>
      <div className="pb-24" />
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Games | ${siteConfig.name}`,
    description:
      'Explore our comprehensive game database with reviews, releases, platforms, and more.',
    openGraph: mergeOpenGraph({
      title: `Games | ${siteConfig.name}`,
      description:
        'Explore our comprehensive game database with reviews, releases, platforms, and more.',
      url: `${getServerSideURL()}/games`,
    }),
  }
}
