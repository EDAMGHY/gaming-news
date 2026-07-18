import type { Metadata } from 'next'

import { RelatedArticles } from '@/blocks/RelatedArticles/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Article } from '@/payload-types'

import { ArticleHero } from '@/heros/ArticleHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const articles = await payload.find({
    collection: 'articles',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = articles.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Article({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/articles/' + slug
  const article = await queryArticleBySlug({ slug })

  if (!article) return <PayloadRedirects url={url} />

  return (
    <article className="pb-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <ArticleHero article={article} />

      <div className="flex flex-col items-center gap-4 pt-12">
        <div className="container">
          <div className="max-w-[48rem] mx-auto mb-10">
            <Link
              href="/articles"
              className="group inline-flex items-center gap-2 pl-2 pr-4 py-2 rounded-full border border-border bg-card text-sm font-semibold text-muted-foreground hover:text-brand hover:border-brand/50 hover:bg-brand/5 transition-all duration-300"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand/10 text-brand transition-transform duration-300 group-hover:-translate-x-0.5">
                <ArrowLeft className="w-4 h-4" />
              </span>
              Back to all articles
            </Link>
          </div>
          <RichText className="max-w-[48rem] mx-auto" data={article.content} enableGutter={false} />
          {article.relatedArticles && article.relatedArticles.length > 0 && (
            <RelatedArticles
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={article.relatedArticles.filter((article) => typeof article === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const article = await queryArticleBySlug({ slug })

  return generateMeta({ doc: article })
}

const queryArticleBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'articles',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  console.log('resultresultresult', result)

  return result.docs?.[0] || null
})
