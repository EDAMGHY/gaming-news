import type { Block } from 'payload'

export const FeaturedReviews: Block = {
  slug: 'featuredReviews',
  interfaceName: 'IFeaturedReviewsBlock',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'link',
      type: 'text',
      admin: { description: 'Optional URL (e.g. /reviews)' },
    },
    {
      name: 'reviews',
      type: 'relationship',
      relationTo: 'reviews',
      hasMany: true,
    },
  ],
}
