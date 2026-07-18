import type { Block } from 'payload'

import { iconOptions } from '../icons'

export const AboutFeatures: Block = {
  slug: 'about-features',
  interfaceName: 'IAboutFeaturesBlock',
  labels: {
    singular: 'About Feature Grid',
    plural: 'About Feature Grids',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'What we cover',
    },
    {
      name: 'subheading',
      type: 'textarea',
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'card',
      options: [
        { label: 'Cards (icon on top, optional link)', value: 'card' },
        { label: 'Rows (icon on the side)', value: 'row' },
      ],
      admin: {
        description: 'Card style suits "what we cover"; row style suits "what we stand for".',
      },
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              type: 'select',
              options: iconOptions,
              defaultValue: 'sparkles',
              admin: { width: '30%' },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: { width: '70%' },
            },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          admin: { description: 'Optional link (card style only), e.g. /reviews' },
        },
      ],
    },
  ],
}
