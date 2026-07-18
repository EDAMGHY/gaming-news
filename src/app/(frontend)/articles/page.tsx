import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import ArticlesPageClient from './page.client'
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
    limit: 1000,
    overrideAccess: false,
    select: {
      id: true,
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className="">
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

      <ArticlesPageClient articles={articles.docs as any} />

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
