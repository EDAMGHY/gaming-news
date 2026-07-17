import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

type ReviewArgs = {
  heroImage: Media
  game: string
}

export const review2: (args: ReviewArgs) => RequiredDataFromCollectionSlug<'reviews'> = ({
  heroImage,
  game,
}) => {
  return {
    title: 'Helldivers 2 - Cooperative Excellence at Its Finest',
    slug: 'helldivers-2-review',
    _status: 'published',
    heroImage: heroImage.id,
    game: game,
    rating: 4.5,
    excerpt: 'Helldivers 2 delivers intense cooperative gameplay with excellent gunplay mechanics and a compelling progression system that keeps you coming back.',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Cooperative Excellence at Its Finest',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h1',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Helldivers 2 is a thrilling cooperative third-person shooter that brings the best of team-based gameplay. With up to 4 players fighting against alien hordes, the action is intense and the teamwork is essential.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    pros: [
      { text: 'Excellent cooperative gameplay mechanics' },
      { text: 'Satisfying gunplay and combat feel' },
      { text: 'Regular content updates and new content' },
      { text: 'Great community and teamwork focus' },
    ],
    cons: [
      { text: 'Can be challenging for solo players' },
      { text: 'Limited single-player content' },
    ],
    meta: {
      title: 'Helldivers 2 Review - Top-Tier Coop Shooter',
      description: 'Our detailed review of Helldivers 2, exploring why this cooperative shooter stands out in the genre.',
      image: heroImage.id,
    },
  }
}
