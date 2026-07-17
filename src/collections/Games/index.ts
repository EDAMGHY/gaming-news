import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

import { generatePreviewPath } from '../../utilities/generatePreviewPath'

export const Games: CollectionConfig<'games'> = {
  slug: 'games',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'releaseDate', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'games',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'games',
        req,
      }),
  },
  defaultPopulate: {
    title: true,
    slug: true,
    coverImage: true,
    screenshots: true,
    releaseDate: true,
    platforms: true,
    synopsis: true,
    meta: {
      image: true,
      description: true,
    },
    genres: true,
    narrativeTags: true,
    length: true,
    relatedGames: true,
  },

  fields: [
    { name: 'title', type: 'text', required: true },

    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'screenshots',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'Game screenshots and images',
      },
    },

    {
      name: 'releaseDate',
      type: 'date',
      admin: { position: 'sidebar' },
    },

    {
      name: 'platforms',
      type: 'select',
      hasMany: true,
      admin: { position: 'sidebar' },
      options: [
        { label: 'PC', value: 'pc' },
        { label: 'PS5', value: 'ps5' },
        { label: 'PS4', value: 'ps4' },
        { label: 'Xbox Series', value: 'xbox-series' },
        { label: 'Xbox One', value: 'xbox-one' },
        { label: 'Nintendo Switch', value: 'switch' },
        { label: 'Nintendo Switch 2', value: 'switch-2' },
        { label: 'Mobile', value: 'mobile' },
      ],
    },

    {
      name: 'genres',
      type: 'relationship',
      relationTo: 'genres',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'narrativeTags',
      type: 'relationship',
      relationTo: 'narrativeTags',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'length',
      type: 'relationship',
      relationTo: 'gameLengths',
      admin: { position: 'sidebar' },
    },
    // Optional metadata (helps later)
    { name: 'developer', type: 'text', admin: { position: 'sidebar' } },
    { name: 'publisher', type: 'text', admin: { position: 'sidebar' } },

    {
      name: 'synopsis',
      type: 'textarea',
      admin: {
        description: 'Brief description of the game',
        rows: 4,
      },
    },

    {
      name: 'relatedGames',
      type: 'relationship',
      relationTo: 'games',
      hasMany: true,
      admin: {
        description: 'Games similar to this one',
      },
    },

    {
      name: 'meta',
      type: 'group',
      fields: [
        OverviewField({
          titlePath: 'meta.title',
          descriptionPath: 'meta.description',
          imagePath: 'meta.image',
        }),
        MetaTitleField({ hasGenerateFn: true }),
        MetaImageField({ relationTo: 'media' }),
        MetaDescriptionField({}),
        PreviewField({
          hasGenerateFn: true,
          titlePath: 'meta.title',
          descriptionPath: 'meta.description',
        }),
      ],
    },

    ...slugField(),
  ],
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
