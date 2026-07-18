import type { Metadata } from 'next/types'
import type { Where } from 'payload'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { QueryPagination } from '@/components/Pagination/QueryPagination'
import { ArticlesSearchAndFilter } from '@/components/SearchAndFilters/ArticlesSearchAndFilter'
import { siteConfig } from '@/config/site'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'

const ARTICLES_PER_PAGE = 12

type Args = {
  searchParams: Promise<{
    page?: string
    search?: string
    category?: string | string[]
  }>
}

export default async function Page({ searchParams }: Args) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)
  const search = typeof params.search === 'string' ? params.search.trim() : ''
  const selectedCategories = Array.isArray(params.category)
    ? params.category
    : params.category
      ? [params.category]
      : []

  const payload = await getPayload({ config: configPromise })

  const where: Where = {}
  if (search) where.title = { like: search }
  if (selectedCategories.length > 0) where.categories = { in: selectedCategories }

  const articles = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: ARTICLES_PER_PAGE,
    page,
    where,
    overrideAccess: false,
    select: {
      id: true,
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  // Facet query: derive the available category options (with counts) from the
  // full collection so filters cover every article, not just the current page.
  const facetSource = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: 1000,
    pagination: false,
    overrideAccess: false,
    select: { categories: true },
  })

  const categoryMap = new Map<string, { name: string; count: number }>()
  facetSource.docs.forEach((article) => {
    ;(article.categories as Array<string | { id: string; title?: string }> | undefined)?.forEach(
      (category) => {
        const id = typeof category === 'string' ? category : category.id
        const name = typeof category === 'string' ? category : category.title || category.id
        const existing = categoryMap.get(id)
        categoryMap.set(id, { name, count: (existing?.count || 0) + 1 })
      },
    )
  })
  const categoryOptions = Array.from(categoryMap.entries()).map(([id, { name, count }]) => ({
    id,
    name,
    count,
  }))

  return (
    <div className="">
      <PageClient />
      <div className="bg-gradient-to-br from-brand/10 via-brand/5 to-transparent border-b border-brand/20 py-16 mb-16">
        <div className="container">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="h-1 w-12 rounded-full bg-brand" />
              <p className="text-brand font-semibold uppercase text-sm tracking-wide">
                Insights & News
              </p>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground">Gaming Articles</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover in-depth articles, industry news, and gaming insights from our expert writers.
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <ArticlesSearchAndFilter categories={categoryOptions} />

        <div className="text-sm text-muted-foreground mb-6">
          Showing {articles.docs.length} of {articles.totalDocs} articles
        </div>

        {articles.docs.length > 0 ? (
          <>
            <div className="mb-8">
              <PageRange
                collection="articles"
                currentPage={articles.page}
                limit={ARTICLES_PER_PAGE}
                totalDocs={articles.totalDocs}
              />
            </div>

            <CollectionArchive articles={articles.docs as any} />

            {articles.totalPages > 1 && articles.page && (
              <QueryPagination page={articles.page} totalPages={articles.totalPages} />
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No articles found matching your criteria.</p>
          </div>
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
