import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

type ReviewArgs = {
  heroImage: Media
  game: string
}

export const review1: (args: ReviewArgs) => RequiredDataFromCollectionSlug<'reviews'> = ({
  heroImage,
  game,
}) => {
  return {
    title: 'Baldurs Gate 3 - A Masterpiece of Interactive Storytelling',
    slug: 'baldurs-gate-3-review',
    _status: 'published',
    heroImage: heroImage.id,
    game: game,
    rating: 5,
    excerpt: 'Baldurs Gate 3 stands as a monumental achievement in gaming, delivering an unparalleled experience with its deep storytelling and meaningful player choices.',
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
                text: 'A Masterpiece of Interactive Storytelling',
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
                text: 'Baldurs Gate 3 is an exceptional RPG that sets a new standard for the genre. With hundreds of hours of content, countless character development paths, and a world that reacts meaningfully to your choices, this game is truly special.',
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
      { text: 'Exceptional storytelling with meaningful choices' },
      { text: 'Incredible character development options' },
      { text: 'Beautiful graphics and immersive world' },
      { text: 'Massive amount of content for replayability' },
    ],
    cons: [
      { text: 'Very demanding system requirements' },
      { text: 'Performance issues on lower-end hardware' },
    ],
    meta: {
      title: 'Baldurs Gate 3 Review - A Gaming Masterpiece',
      description: 'Read our comprehensive review of Baldurs Gate 3, the RPG that revolutionizes interactive storytelling.',
      image: heroImage.id,
    },
  }
}
