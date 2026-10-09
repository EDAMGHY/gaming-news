/**
 * The primary sections of Save Point. Each one owns a face-button glyph from the
 * logo mark, so the header can light the matching dot for where the reader is.
 */
export type SectionKey = 'news' | 'review' | 'game'

export type Section = {
  key: SectionKey
  label: string
  href: string
  blurb: string
}

export const sections: Section[] = [
  { key: 'news', label: 'News', href: '/articles', blurb: 'Reporting, previews and features' },
  { key: 'review', label: 'Reviews', href: '/reviews', blurb: 'Scored verdicts, pros and cons' },
  { key: 'game', label: 'Games', href: '/games', blurb: 'The database, by platform and genre' },
]

/** Platform shortcuts into the games database filter (`/games?platform=`). */
export const platformShortcuts = [
  { value: 'pc', label: 'PC' },
  { value: 'ps5', label: 'PS5' },
  { value: 'xbox-series', label: 'Xbox Series' },
  { value: 'switch-2', label: 'Switch 2' },
  { value: 'switch', label: 'Switch' },
  { value: 'mobile', label: 'Mobile' },
]

export const sectionForPath = (pathname: string): SectionKey | null =>
  sections.find((s) => pathname === s.href || pathname.startsWith(`${s.href}/`))?.key ?? null

/** Hrefs already covered by the primary sections (plus home). */
export const primaryHrefs = new Set(['/', '/home', ...sections.map((s) => s.href)])
