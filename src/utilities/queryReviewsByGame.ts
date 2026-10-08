import type { Payload } from 'payload'

export type GameReviewQueryPayload = Pick<Payload, 'find'>

type QueryReviewsByGameArgs = {
  gameId: string
  payload: GameReviewQueryPayload
}

export async function queryReviewsByGame({ gameId, payload }: QueryReviewsByGameArgs) {
  const reviews = await payload.find({
    collection: 'reviews',
    draft: false,
    limit: 6,
    overrideAccess: false,
    pagination: false,
    where: {
      game: {
        equals: gameId,
      },
    },
    select: {
      title: true,
      slug: true,
      rating: true,
      excerpt: true,
      heroImage: true,
      game: true,
      platformTested: true,
      hoursPlayed: true,
      meta: true,
      categories: true,
    },
  })

  return reviews.docs
}
