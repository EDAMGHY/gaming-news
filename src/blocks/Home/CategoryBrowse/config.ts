import type { Block } from 'payload'

export const CategoryBrowse: Block = {
  slug: 'category-browse',
  interfaceName: 'ICategoryBrowseBlock',

  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
      admin: { description: 'Optional heading (defaults to "Browse by Category")' },
    },
    {
      name: 'description',
      type: 'text',
      required: false,
      admin: { description: 'Optional short text under the heading' },
    },
  ],
  labels: {
    plural: 'Category Browse Blocks',
    singular: 'Category Browse Block',
  },
}
