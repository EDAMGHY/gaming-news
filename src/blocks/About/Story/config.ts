import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const AboutStory: Block = {
  slug: 'about-story',
  interfaceName: 'IAboutStoryBlock',
  labels: {
    singular: 'About Story',
    plural: 'About Stories',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Our Mission',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Cut through the noise. Get to what matters.',
    },
    {
      name: 'body',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'quote',
      type: 'textarea',
      admin: { description: 'Optional pull-quote shown in the card' },
    },
    {
      type: 'row',
      fields: [
        { name: 'quoteAuthor', type: 'text', admin: { width: '50%' } },
        { name: 'quoteRole', type: 'text', admin: { width: '50%' } },
      ],
    },
  ],
}
