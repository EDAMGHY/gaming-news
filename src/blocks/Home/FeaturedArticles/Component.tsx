'use client'
import React from 'react'

import type { IFeaturedArticlesBlock } from '@/payload-types'

import RichText from '@/components/RichText'
import { isArticle } from '@/utilities/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/Slider/Slider'
import { FeaturedArticle } from './FeaturedArticle'
import { SwiperSlide } from 'swiper/react'

export const FeaturedArticlesBlock: React.FC<IFeaturedArticlesBlock> = ({
  articles: articleDocs,
  description,
  link,
  title,
  blockType,
  id,
}) => {
  const articles = (articleDocs ?? []).filter(isArticle)

  return (
    <div id={id || ''} block-id={blockType} className="container space-y-6">
      <div className="flex justify-between items-end gap-4">
        <div className="space-y-2">
          {title && <h2 className="text-4xl font-bold">{title}</h2>}

          {description && (
            <RichText
              className="text-muted-foreground mb-0"
              data={description}
              enableGutter={false}
            />
          )}
        </div>

        <Button variant="primary" asChild>
          <Link href={link!}>See More</Link>
        </Button>
      </div>
      <Slider autoplay={false}>
        {articles.map((article) => (
          <SwiperSlide key={article.id}>
            <FeaturedArticle {...article} />
          </SwiperSlide>
        ))}
      </Slider>
    </div>
  )
}
