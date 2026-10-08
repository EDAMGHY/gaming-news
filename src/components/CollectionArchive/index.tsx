import React from 'react'

import {
  ArticleCard,
  type ArticleCardData,
  GameCard,
  type GameCardData,
  ReviewCard,
  type ReviewCardData,
} from '@/components/ContentCard'

export type Props = {
  articles?: (ArticleCardData & { relationTo?: 'articles' | 'reviews' | 'games' })[]
  reviews?: ReviewCardData[]
  games?: GameCardData[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { articles, reviews, games } = props

  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {articles?.map((article, index) => {
          if (article.relationTo === 'reviews') {
            return (
              <ReviewCard
                key={article.id ?? `review-${index}`}
                review={article as ReviewCardData}
              />
            )
          }
          if (article.relationTo === 'games') {
            return <GameCard key={article.id ?? `game-${index}`} game={article as GameCardData} />
          }
          return <ArticleCard article={article} key={article.id ?? `article-${index}`} />
        })}
        {reviews?.map((review, index) => (
          <ReviewCard key={review.id ?? `review-${index}`} review={review} />
        ))}
        {games?.map((game, index) => (
          <GameCard game={game} key={game.id ?? `game-${index}`} />
        ))}
      </div>
    </div>
  )
}
