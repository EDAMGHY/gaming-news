import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { linkGroup } from '@/fields/linkGroup'

export const FeaturedArticles: Block = {
  slug: 'featured-articles',
  interfaceName: 'IFeaturedArticlesBlock',

  fields: [
    {
      name: 'articles',
      type: 'array',
      required: true,
      minRows: 1,
      // optional:
      // maxRows: 6,
      labels: {
        singular: 'Featured Article',
        plural: 'Featured Articles',
      },
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
              ]
            },
          }),
          label: false,
        },
        linkGroup({
          appearances: ['default', 'outline'],
          overrides: {
            maxRows: 2,
          },
        }),
      ],
    },
  ],
  labels: {
    plural: 'Featured Articles Blocks',
    singular: 'Featured Articles Block',
  },
}
