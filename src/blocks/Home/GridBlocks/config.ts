import { Archive } from '@/blocks/ArchiveBlock/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { FormBlock } from '@/blocks/Form/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import type { Block } from 'payload'
import { FeaturedArticles } from '../FeaturedArticles/config'
import { FeaturedReviews } from '../FeaturedReviews/config'
import { TopReviews } from '../TopReviews/config'
import { UpcomingGames } from '../UpcomingGames/config'

export const GridBlocks: Block = {
  slug: 'grid-blocks',
  interfaceName: 'IGridBlocksBlock',

  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
      admin: {
        description: 'Optional heading shown above the featured articles',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: false,
      admin: {
        description: 'Optional short text under the heading',
      },
    },
    {
      name: 'link',
      type: 'text',
      required: false,
      admin: {
        description: 'Optional URL (e.g. /articles)',
      },
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        Archive,
        CallToAction,
        Content,
        FormBlock,
        MediaBlock,
        FeaturedArticles,
        FeaturedReviews,
        TopReviews,
        UpcomingGames,
      ],
    },
  ],
  labels: {
    plural: 'Grid Blocks',
    singular: 'Grid Block',
  },
}
