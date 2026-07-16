import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { slugField } from '@/fields/slug'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

import { populateAuthors } from './hooks/populateAuthors'
import { revalidateDelete, revalidateReview } from './hooks/revalidateReview'

export const Reviews: CollectionConfig<'reviews'> = {
  slug: 'reviews',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'game', 'rating', 'publishedAt', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'reviews',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'reviews',
        req,
      }),
  },

  defaultPopulate: {
    title: true,
    slug: true,
    rating: true,
    heroImage: true,
    excerpt: true,
    game: true, // ✅ so referenced reviews include game basic fields
    meta: { image: true, description: true },
    createdAt: true,
  },

  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'game',
              type: 'relationship',
              relationTo: 'games',
              required: true,
              admin: { position: 'sidebar' },
            },

            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },

            {
              name: 'excerpt',
              type: 'textarea',
              maxLength: 220,
              admin: { description: 'Short summary shown on listing cards (optional).' },
            },

            {
              name: 'rating',
              type: 'number',
              min: 0,
              max: 5,
              required: true,
              admin: { position: 'sidebar', step: 0.5 },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
              label: false,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'pros',
                  type: 'array',
                  labels: { singular: 'Pro', plural: 'Pros' },
                  fields: [{ name: 'text', type: 'text', required: true }],
                  admin: { width: '50%' },
                },
                {
                  name: 'cons',
                  type: 'array',
                  labels: { singular: 'Con', plural: 'Cons' },
                  fields: [{ name: 'text', type: 'text', required: true }],
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Related Reviews',
          fields: [
            {
              name: 'authors',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              hasMany: true,
              relationTo: 'users',
            },
            // This field is only used to populate the user data via the `populateAuthors` hook
            // This is because the `user` collection has access control locked to protect user privacy
            // GraphQL will also not return mutated user data that differs from the underlying schema
            {
              name: 'populatedAuthors',
              type: 'array',
              access: {
                update: () => false,
              },
              admin: {
                disabled: true,
                readOnly: true,
              },
              fields: [
                {
                  name: 'id',
                  type: 'text',
                },
                {
                  name: 'name',
                  type: 'text',
                },
              ],
            },

            {
              name: 'relatedReviews',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
              hasMany: true,
              relationTo: 'reviews',
            },
          ],
        },
        {
          label: 'Meta',
          fields: [
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
          ],
        },
      ],
    },

    {
      name: 'publishedAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' }, position: 'sidebar' },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) return new Date()
            return value
          },
        ],
      },
    },

    {
      name: 'categories',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'categories',
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidateReview],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: { autosave: { interval: 100 }, schedulePublish: true },
    maxPerDoc: 50,
  },
}
