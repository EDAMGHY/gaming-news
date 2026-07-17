import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

type GameArgs = {
  coverImage: Media
}

export const game1: (args: GameArgs) => RequiredDataFromCollectionSlug<'games'> = ({
  coverImage,
}) => {
  return {
    title: 'Elden Ring: Shadow of the Erdtree',
    slug: 'elden-ring-shadow-of-the-erdtree',
    _status: 'published',
    coverImage: coverImage.id,
    releaseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    platforms: ['pc', 'ps5', 'xbox-series'],
    developer: 'FromSoftware',
    publisher: 'Bandai Namco Entertainment',
    meta: {
      title: 'Elden Ring: Shadow of the Erdtree - Upcoming DLC',
      description: 'The highly anticipated expansion for Elden Ring is coming soon with new bosses, items, and story content.',
      image: coverImage.id,
    },
  }
}
