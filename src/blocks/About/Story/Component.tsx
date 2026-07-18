import React from 'react'
import { Target } from 'lucide-react'

import type { IAboutStoryBlock } from '@/payload-types'
import RichText from '@/components/RichText'

const initials = (name?: string | null) =>
  (name || '')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

export const AboutStoryBlock: React.FC<IAboutStoryBlock> = ({
  eyebrow,
  heading,
  body,
  quote,
  quoteAuthor,
  quoteRole,
}) => {
  return (
    <section className="container py-20">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          {eyebrow && (
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-400">
              <Target className="h-4 w-4" />
              {eyebrow}
            </span>
          )}
          <h2 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">{heading}</h2>
          {body && (
            <div className="mt-6 text-muted-foreground [&_p]:mb-4 last:[&_p]:mb-0">
              <RichText data={body} enableGutter={false} enableProse={false} />
            </div>
          )}
        </div>

        {quote && (
          <div className="relative">
            <div className="rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/10 via-background to-cyan-500/5 p-8 md:p-10">
              <blockquote className="text-xl font-medium leading-relaxed text-foreground md:text-2xl">
                &ldquo;{quote}&rdquo;
              </blockquote>
              {(quoteAuthor || quoteRole) && (
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-brand-500 to-cyan-400 font-bold text-white">
                    {initials(quoteAuthor) || '★'}
                  </div>
                  <div>
                    {quoteAuthor && <div className="font-semibold text-foreground">{quoteAuthor}</div>}
                    {quoteRole && <div className="text-sm text-muted-foreground">{quoteRole}</div>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
