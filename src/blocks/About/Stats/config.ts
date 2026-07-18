import type { Block } from 'payload'

export const AboutStats: Block = {
  slug: 'about-stats',
  interfaceName: 'IAboutStatsBlock',
  labels: {
    singular: 'About Stats',
    plural: 'About Stats',
  },
  fields: [
    {
      name: 'autoCounts',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'Automatically fill the first three stats with live published counts of Games, Reviews and Articles. Uncheck to use the manual values below for every stat.',
      },
    },
    {
      name: 'stats',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      admin: {
        description:
          'When "auto counts" is on, the first three items use live data and only their labels are used.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: { width: '40%', description: 'e.g. 120+ or 100%' },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: { width: '60%' },
            },
          ],
        },
      ],
    },
  ],
}
