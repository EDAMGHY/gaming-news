import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { ILatestArticlesBlock } from '@/payload-types'
import { ArticleCard } from '@/components/ContentCard'
import { ContentSectionHeader } from '@/components/ContentSectionHeader'

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
      <ContentSectionHeader
        actionHref={link}
        description={description}
        eyebrow="Fresh from the desk"
        title={title || 'Latest news'}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {articles.map((article) => (
          <ArticleCard article={article} key={article.id} />
        ))}
      </div>
    </section>
  )
}
