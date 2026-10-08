import type { Media } from '@/payload-types'
import type { RequiredDataFromCollectionSlug } from 'payload'

type HomeArgs = {
  heroImage: Media
  metaImage: Media
}

export const home: (args: HomeArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  heroImage,
  metaImage,
}) => ({
  slug: 'home',
  _status: 'published',
  title: 'Home',
  hero: {
    type: 'highImpact',
    media: heroImage.id,
    links: [
      {
        link: {
          type: 'custom',
          appearance: 'default',
          label: 'Read the latest',
          url: '/articles',
        },
      },
      {
        link: {
          type: 'custom',
          appearance: 'outline',
          label: 'Browse games',
          url: '/games',
        },
      },
    ],
    richText: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            tag: 'h1',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Games move fast. Keep the signal clear.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
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
                text: 'News without the noise, reviews built on time played, and a clean read on what is releasing next.',
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
  },
  layout: [
    {
      blockName: 'Latest Articles',
      blockType: 'latest-articles',
      title: 'Latest from the desk',
      description: 'Breaking stories, sharp analysis, and useful context from across games.',
      link: '/articles',
      limit: 6,
    },
    {
      blockName: 'Top Reviews',
      blockType: 'topReviews',
      title: 'The review scoreboard',
      description: 'The games that stayed with us after the credits rolled.',
      link: '/reviews',
      limit: 6,
      minRating: 0,
    },
    {
      blockName: 'Upcoming Games',
      blockType: 'upcoming-games',
      title: 'Next in the queue',
      link: '/games',
      limit: 6,
      rangePreset: '365d',
    },
    {
      blockName: 'Browse',
      blockType: 'category-browse',
      title: 'Find your lane',
      description: 'Jump into a topic or browse games by genre.',
    },
  ],
  meta: {
    description: 'Gaming news, deeply tested reviews, and a practical games database.',
    image: metaImage.id,
    title: 'Gaming News',
  },
})
