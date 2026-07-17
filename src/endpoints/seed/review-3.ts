import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

type ReviewArgs = {
  heroImage: Media
  game: string
}

export const review3: (args: ReviewArgs) => RequiredDataFromCollectionSlug<'reviews'> = ({
  heroImage,
  game,
}) => {
  return {
    title: 'Palworld - An Addictive Pokemon-Like Adventure',
    slug: 'palworld-review',
    _status: 'published',
    heroImage: heroImage.id,
    game: game,
    rating: 4,
    excerpt: 'Palworld captures the spirit of creature collection with modern gameplay mechanics, creating an addictive and engaging experience that fans of the genre will love.',
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
                text: 'An Addictive Creature Collection Adventure',
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
                text: 'Palworld brings fresh energy to the creature collection genre with its unique blend of exploration, base building, and creature care mechanics that create a deeply engaging gameplay loop.',
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
      { text: 'Engaging creature collection mechanics' },
      { text: 'Creative base building system' },
      { text: 'Fun multiplayer experiences' },
      { text: 'Steady content updates' },
    ],
    cons: [
      { text: 'Some performance optimization issues' },
      { text: 'Can feel grindy at times' },
    ],
    meta: {
      title: 'Palworld Review - A Fresh Take on Creature Collection',
      description: 'Discover why Palworld is capturing the hearts of millions of players worldwide in our comprehensive review.',
      image: heroImage.id,
    },
  }
}
