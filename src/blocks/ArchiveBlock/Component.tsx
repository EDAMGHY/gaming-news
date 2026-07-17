import type { Article, Review, Game, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const {
    id,
    categories,
    introContent,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
    relationTo,
    where,
  } = props

  const limit = limitFromProps || 3

  let articles: Article[] = []
  let reviews: Review[] = []
  let games: Game[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    if (relationTo === 'articles' || !relationTo) {
      const whereClause: any = {}

      if (flattenedCategories && flattenedCategories.length > 0) {
        if (where) {
          whereClause.and = [
            {
              categories: {
                in: flattenedCategories,
              },
            },
            where,
          ]
        } else {
          whereClause.categories = {
            in: flattenedCategories,
          }
        }
      } else if (where) {
        Object.assign(whereClause, where)
      }

      const fetchedArticles = await payload.find({
        collection: 'articles',
        depth: 1,
        limit,
        ...(Object.keys(whereClause).length > 0 ? { where: whereClause } : {}),
      })

      articles = fetchedArticles.docs
    } else if (relationTo === 'reviews') {
      const reviewWhere: any = where || {}

      const fetchedReviews = await payload.find({
        collection: 'reviews',
        depth: 1,
        limit,
        ...(Object.keys(reviewWhere).length > 0 ? { where: reviewWhere } : {}),
      })

      reviews = fetchedReviews.docs
    } else if (relationTo === 'games') {
      const gameWhere: any = where || {}

      const fetchedGames = await payload.find({
        collection: 'games',
        depth: 1,
        limit,
        ...(Object.keys(gameWhere).length > 0 ? { where: gameWhere } : {}),
      })

      games = fetchedGames.docs
    }
  } else {
    if (selectedDocs?.length) {
      const filtered = selectedDocs.map((doc) => {
        if (typeof doc.value === 'object') return doc.value
      }) as (Article | Review | Game)[]

      if (relationTo === 'reviews') {
        reviews = filtered as Review[]
      } else if (relationTo === 'games') {
        games = filtered as Game[]
      } else {
        articles = filtered as Article[]
      }
    }
  }

  const hasContent = articles.length > 0 || reviews.length > 0 || games.length > 0

  if (!hasContent) {
    return null
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <CollectionArchive articles={articles} reviews={reviews} games={games} />
    </div>
  )
}
