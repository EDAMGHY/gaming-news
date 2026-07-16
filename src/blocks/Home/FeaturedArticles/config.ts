import type { Block } from 'payload'

export const FeaturedArticles: Block = {
  slug: 'featured-articles',
  interfaceName: 'IFeaturedArticlesBlock',

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
    // Optional link (simple)
    {
      name: 'link',
      type: 'text',
      required: false,
      admin: {
        description: 'Optional URL (e.g. /articles)',
      },
    },
    {
      name: 'articles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      required: false,
      admin: {
        description: 'Select articles to feature in this block',
      },
    },
  ],
  labels: {
    plural: 'Featured Articles Blocks',
    singular: 'Featured Articles Block',
  },
}
