import type { Block } from 'payload'

export const UpcomingGames: Block = {
  slug: 'upcoming-games',
  interfaceName: 'IUpcomingGamesBlock',

  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
      admin: {
        description: 'Optional heading shown above the upcoming games',
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
        description: 'Optional URL (e.g. /upcoming-games)',
      },
    },

    // ✅ how many games
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
      min: 1,
      max: 50,
    },

    // ✅ preset window
    {
      name: 'rangePreset',
      type: 'select',
      defaultValue: '30d',
      options: [
        { label: 'Next 1 month', value: '30d' },
        { label: 'Next 3 months', value: '90d' },
        { label: 'Next 6 months', value: '180d' },
        { label: 'Next 12 months', value: '365d' },
        { label: 'Custom range', value: 'custom' },
      ],
    },

    // ✅ custom range (only when preset = custom)
    {
      name: 'startDate',
      type: 'date',
      admin: {
        condition: (_, siblingData) => siblingData?.rangePreset === 'custom',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        condition: (_, siblingData) => siblingData?.rangePreset === 'custom',
      },
    },
  ],
  labels: {
    plural: 'Upcoming Games',
    singular: 'Upcoming Game',
  },
}
