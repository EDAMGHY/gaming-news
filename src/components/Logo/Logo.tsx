import { cn } from '@/utilities/ui'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  /** `full` shows mark + wordmark, `mark` shows the face-button mark only. */
  variant?: 'full' | 'mark'
}

/**
 * The four face-button dots double as the site's content glyphs:
 * yellow = reviews, red = news, green = guides, blue = games.
 */
export const LogoMark = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={cn('savepoint-mark size-8 shrink-0', className)}
    fill="none"
    viewBox="0 0 32 32"
  >
    <circle cx="16" cy="6.5" data-glyph="review" fill="hsl(var(--glyph-review))" r="5" />
    <circle cx="25.5" cy="16" data-glyph="news" fill="hsl(var(--glyph-news))" r="5" />
    <circle cx="16" cy="25.5" data-glyph="guide" fill="hsl(var(--glyph-guide))" r="5" />
    <circle cx="6.5" cy="16" data-glyph="game" fill="hsl(var(--glyph-game))" r="5" />
  </svg>
)

export const Logo = (props: Props) => {
  const { className, variant = 'full' } = props

  return (
    <span
      aria-label="Save Point"
      className={cn('inline-flex items-center gap-2.5 text-foreground', className)}
      role="img"
    >
      <LogoMark />
      {variant === 'full' && (
        <span
          aria-hidden="true"
          className="font-display text-[1.05rem] font-black uppercase leading-none tracking-[-0.02em] sm:text-[1.2rem]"
          style={{ fontStretch: '140%' }}
        >
          Save<span className="text-brand">·</span>Point
        </span>
      )}
    </span>
  )
}
