import { Review } from '@/payload-types'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export const TopReviewItem = ({ title, rating, slug, game, rank }: Review & { rank: number }) => {
  const gameTitle = typeof game === 'object' ? game.title : undefined

  return (
    <article className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 py-5 sm:grid-cols-[3rem_1fr_auto] sm:gap-6">
      <span className="font-mono text-sm text-muted-foreground">
        {String(rank).padStart(2, '0')}
      </span>
      <Link
        href={`/reviews/${slug}`}
        className="min-w-0 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {gameTitle && (
          <p className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-brand">
            {gameTitle}
          </p>
        )}
        <h3 className="line-clamp-2 text-base font-semibold transition-colors group-hover:text-brand lg:text-lg">
          {title}
        </h3>
      </Link>
      <div className="flex items-center gap-3">
        <div className="grid size-12 place-items-center rounded-md bg-foreground font-mono text-lg font-bold text-background">
          {rating}
        </div>
        <ArrowUpRight
          aria-hidden="true"
          className="hidden size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block"
        />
      </div>
    </article>
  )
}
