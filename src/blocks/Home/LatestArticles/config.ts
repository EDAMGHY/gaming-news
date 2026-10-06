import type { Block } from 'payload'

export const LatestArticles: Block = {
  slug: 'latest-articles',
  interfaceName: 'ILatestArticlesBlock',

  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
      admin: { description: 'Optional heading (defaults to "Latest News")' },
    },
    {
      name: 'description',
      type: 'text',
      required: false,
      admin: { description: 'Optional short text under the heading' },
    },
    {
      name: 'link',
      type: 'text',
      required: false,
      admin: { description: 'Optional URL for the "View all" button (e.g. /articles)' },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
      min: 1,
      max: 12,
    },
  ],
  labels: {
    plural: 'Latest Articles Blocks',
    singular: 'Latest Articles Block',
  },
}
