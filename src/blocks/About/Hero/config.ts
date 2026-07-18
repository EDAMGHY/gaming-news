import type { Block } from 'payload'

import { link } from '../../../fields/link'

export const AboutHero: Block = {
  slug: 'about-hero',
  interfaceName: 'IAboutHeroBlock',
  labels: {
    singular: 'About Hero',
    plural: 'About Heroes',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      defaultValue: 'About Gaming News',
      admin: { description: 'Small pill label above the heading' },
    },
    {
      name: 'headingLead',
      type: 'text',
      required: true,
      defaultValue: 'Where players come to',
      admin: { description: 'First part of the heading (normal color)' },
    },
    {
      name: 'headingHighlight',
      type: 'text',
      required: true,
      defaultValue: 'stay ahead of the game',
      admin: { description: 'Highlighted (gradient) part of the heading' },
    },
    {
      name: 'subheading',
      type: 'textarea',
      defaultValue:
        "We're an independent gaming publication delivering trustworthy news, honest reviews, and a living database of every release worth your time — written by players, for players.",
    },
    {
      name: 'buttons',
      type: 'array',
      maxRows: 2,
      fields: [link({ appearances: false })],
    },
  ],
}
