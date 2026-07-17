import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from '../../page.client'
import { siteConfig } from '@/config/site'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber = '1' } = await paramsPromise
  const parsedPage = parseInt(pageNumber)
  const payload = await getPayload({ config: configPromise })

  const games = await payload.find({
    collection: 'games',
    depth: 1,
    limit: 12,
    page: parsedPage,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      meta: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Games</h1>
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
    </div>
  )
}


export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber = '1' } = await paramsPromise
  return {
    title: `Games - Page ${pageNumber} | ${siteConfig.name}`,
    description: 'Explore our comprehensive game database with reviews, releases, platforms, and more.',
    openGraph: mergeOpenGraph({
      title: `Games - Page ${pageNumber} | ${siteConfig.name}`,
      description: 'Explore our comprehensive game database with reviews, releases, platforms, and more.',
      url: `${getServerSideURL()}/games/page/${pageNumber}`,
    }),
  }
}
