import type { Block } from 'payload'

export const AboutTeam: Block = {
  slug: 'about-team',
  interfaceName: 'IAboutTeamBlock',
  labels: {
    singular: 'About Team',
    plural: 'About Teams',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'The people behind it',
    },
    {
      name: 'subheading',
      type: 'textarea',
    },
    {
      name: 'members',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'role', type: 'text', required: true, admin: { width: '50%' } },
          ],
        },
        {
          name: 'bio',
          type: 'textarea',
        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Optional. Falls back to the member’s initials.' },
        },
        {
          name: 'accent',
          type: 'select',
          defaultValue: 'brand',
          admin: { description: 'Avatar gradient used when there is no photo.' },
          options: [
            { label: 'Brand / Cyan', value: 'brand' },
            { label: 'Fuchsia / Purple', value: 'fuchsia' },
            { label: 'Amber / Orange', value: 'amber' },
            { label: 'Emerald / Teal', value: 'emerald' },
          ],
        },
      ],
    },
  ],
}
