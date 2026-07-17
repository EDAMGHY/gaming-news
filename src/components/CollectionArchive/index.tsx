import { cn } from '@/utilities/ui'
import React from 'react'

import { Card, CardPostData } from '@/components/Card'

export type Props = {
  articles?: (CardPostData & { relationTo?: string })[]
  reviews?: CardPostData[]
  games?: CardPostData[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { articles, reviews, games } = props
  const array = [...(articles || []), ...(reviews || []), ...(games || [])]
  return (
    <div className={cn('container')}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {array?.map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            let relationTo: 'articles' | 'reviews' | 'games' = 'articles'

            // Check if the result has its own relationTo (from search results)
            if ('relationTo' in result && result.relationTo) {
              relationTo = result.relationTo as 'articles' | 'reviews' | 'games'
            } else if (articles && articles?.length > 0) {
              relationTo = 'articles'
            } else if (reviews && reviews?.length > 0) {
              relationTo = 'reviews'
            } else if (games && games?.length > 0) {
              relationTo = 'games'
            }

            return (
              <Card
                key={index}
                className="h-full"
                doc={result}
                relationTo={relationTo}
                showCategories={relationTo !== 'games'}
              />
            )
          }

          return null
        })}
      </div>
    </div>
  )
}
