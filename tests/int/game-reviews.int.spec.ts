import type { GameReviewQueryPayload } from '@/utilities/queryReviewsByGame'

import { queryReviewsByGame } from '@/utilities/queryReviewsByGame'
import { describe, expect, it, vi } from 'vitest'

type TestReview = {
  game: string
  id: string
  slug: string
  title: string
}

const makeReview = (game: string, index: number): TestReview => ({
  game,
  id: `${game}-review-${index}`,
  slug: `${game}-review-${index}`,
  title: `${game} review ${index}`,
})

function makePayload(reviews: TestReview[]) {
  const find = vi.fn(async (options: { where?: { game?: { equals?: string } } }) => {
    const gameId = options.where?.game?.equals
    const docs = reviews
      .filter((review) => review.game === gameId)
      .map(({ game: _game, ...review }) => review)

    return {
      docs,
      hasNextPage: false,
      hasPrevPage: false,
      limit: 6,
      nextPage: null,
      page: 1,
      pagingCounter: 1,
      prevPage: null,
      totalDocs: docs.length,
      totalPages: 1,
    }
  })

  return {
    find,
    payload: { find } as unknown as GameReviewQueryPayload,
  }
}

describe('queryReviewsByGame', () => {
  it.each([
    { count: 0, label: 'zero' },
    { count: 1, label: 'one' },
    { count: 3, label: 'multiple' },
  ])('returns $label reviews related to the current game', async ({ count }) => {
    const currentGameId = 'current-game'
    const reviews = [
      ...Array.from({ length: count }, (_, index) => makeReview(currentGameId, index)),
      makeReview('different-game-with-the-same-genre', 1),
    ]
    const { find, payload } = makePayload(reviews)

    const result = await queryReviewsByGame({ gameId: currentGameId, payload })

    expect(result).toHaveLength(count)
    expect(result.every((review) => review.id.startsWith(currentGameId))).toBe(true)
    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'reviews',
        where: {
          game: {
            equals: currentGameId,
          },
        },
      }),
    )
  })
})
