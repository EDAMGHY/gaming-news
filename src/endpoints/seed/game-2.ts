import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

type GameArgs = {
  coverImage: Media
}

export const game2: (args: GameArgs) => RequiredDataFromCollectionSlug<'games'> = ({
  coverImage,
}) => {
  return {
    title: 'Final Fantasy VII Rebirth',
    slug: 'final-fantasy-vii-rebirth',
    _status: 'published',
    coverImage: coverImage.id,
    releaseDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 60 days from now
    platforms: ['ps5'],
    developer: 'Square Enix',
    publisher: 'Square Enix',
    meta: {
      title: 'Final Fantasy VII Rebirth - Coming Soon',
      description: 'The third installment of the Final Fantasy VII Remake project brings Cloud\'s story to a spectacular conclusion.',
      image: coverImage.id,
    },
  }
}
