import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { ILatestArticlesBlock } from '@/payload-types'
import { Card } from '@/components/Card'
import { Button } from '@/components/ui/button'

export const LatestArticlesBlock: React.FC<ILatestArticlesBlock> = async ({
  title,
  description,
  link,
  limit,
}) => {
  const payload = await getPayload({ config: configPromise })

  const res = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: limit ?? 6,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
    overrideAccess: false,
  })

  const articles = res?.docs ?? []

  if (articles.length === 0) return null

  return (
    <section className="container py-6 lg:py-12">
      <header className="mb-10 flex items-start justify-between gap-6 pb-8 border-b-2 border-brand/20">
        <div className="space-y-2 flex-1">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground flex items-center gap-3">
            <span className="h-12 w-1 rounded-full bg-brand" />
            {title || 'Latest News'}
          </h2>
          {description && <p className="text-muted-foreground max-w-2xl ml-4">{description}</p>}
        </div>
        {link && (
          <Button variant="primary" className="shrink-0" asChild>
            <Link href={link}>View all</Link>
          </Button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {articles.map((article) => (
          <Card
            key={article.id}
            className="h-full"
            doc={article}
            relationTo="articles"
            showCategories
          />
        ))}
      </div>
    </section>
  )
}
