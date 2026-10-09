import React from 'react'

import type { IFeaturedArticlesBlock } from '@/payload-types'

import RichText from '@/components/RichText'
import { isArticle } from '@/utilities/utils'
import { Slider } from '@/components/Slider/Slider'
import { FeaturedArticle } from './FeaturedArticle'
import { ContentSectionHeader } from '@/components/ContentSectionHeader'

export const FeaturedArticlesBlock: React.FC<IFeaturedArticlesBlock> = ({
  articles: articleDocs,
  description,
  link,
  title,
  blockType,
  id,
}) => {
  const articles = (articleDocs ?? []).filter(isArticle)

  if (articles.length === 0) return null

  return (
    <div id={id || ''} block-id={blockType} className="container space-y-6">
      <ContentSectionHeader
        actionHref={link}
        description={
          description ? (
            <RichText className="mb-0" data={description} enableGutter={false} />
          ) : undefined
        }
        eyebrow="Editor picks"
        title={title || 'Worth your time'}
      />
      <Slider autoplay={8000} label={title || 'Editor picks'} size="card">
        {articles.map((article) => (
          <FeaturedArticle key={article.id} {...article} />
        ))}
      </Slider>
    </div>
  )
}
