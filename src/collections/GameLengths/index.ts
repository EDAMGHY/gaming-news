import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'
import { slugField } from '@/fields/slug'

export const GameLengths: CollectionConfig = {
  slug: 'gameLengths',
  access: {
    create: authenticated,
    update: authenticated,
    delete: authenticated,
    read: anyone,
  },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'updatedAt'],
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'minHours',
      type: 'number',
    },
    {
      name: 'maxHours',
      type: 'number',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    ...slugField(),
  ],
}
