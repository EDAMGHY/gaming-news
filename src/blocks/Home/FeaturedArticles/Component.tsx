import React from 'react'

import type { IFeaturedArticlesBlock } from '@/payload-types'

import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

export const FeaturedArticlesBlock: React.FC<IFeaturedArticlesBlock> = ({
  articles = [],
  blockName,
  blockType,
  id,
}) => {
  console.log('oqwiyrupqw8yripuqweyriuwqyer', {
    articles,
    blockName,
    blockType,
    id,
  })

  return (
    <div id={id || ''} block-id={blockType} className="container">
      {articles.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {articles.map((article, index) => (
            <div
              key={index}
              className="w-full bg-card rounded border-border border p-4 flex flex-col gap-4"
            >
              {article.media && (
                <Media
                  imgClassName={cn('border border-border rounded-[0.8rem]')}
                  resource={article.media}
                />
              )}
              <div>
                {article.title && <h2 className="text-2xl font-semibold">{article.title}</h2>}
                {article.description && (
                  <RichText className="mb-0" data={article.description} enableGutter={false} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
