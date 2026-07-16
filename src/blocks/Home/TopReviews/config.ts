import type { Block } from 'payload'

export const TopReviews: Block = {
  slug: 'topReviews',
  interfaceName: 'ITopReviewsBlock',
  fields: [
    { name: 'title', type: 'text', defaultValue: 'Top Reviews' },
    { name: 'description', type: 'textarea' },
    {
      name: 'link',
      type: 'text',
      admin: { description: 'Optional URL (e.g. /reviews)' },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
      min: 1,
      max: 12,
      admin: { position: 'sidebar' },
    },
    {
      name: 'minRating',
      type: 'number',
      defaultValue: 2,
      min: 0,
      max: 5,
      admin: { position: 'sidebar', step: 0.5 },
    },
  ],
}
