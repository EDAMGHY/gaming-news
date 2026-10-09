import type { ReactNode } from 'react'

import type { CarouselOptions } from '@/components/ui/carousel'

/**
 * - `full`: one slide at a time (hero-style features)
 * - `wide`: two per row from tablet up
 * - `card`: one, two, then three per row, matching the content card grids
 * - `compact`: four to five per row, for game covers and other small tiles
 */
export type SliderSize = 'full' | 'wide' | 'card' | 'compact'

export interface SliderProps {
  /** Each child is rendered as one slide. */
  children: ReactNode
  /** Accessible name for the carousel region, e.g. the section title. */
  label: string
  /** Delay in ms between slides, or `true` for the default 7s. Off by default. */
  autoplay?: boolean | number
  className?: string
  loop?: boolean
  /** Raw Embla options, merged over the defaults. */
  opts?: CarouselOptions
  size?: SliderSize
  slideClassName?: string
}
