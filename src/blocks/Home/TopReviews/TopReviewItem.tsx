import { Rating } from '@/components/Rating/Rating'
import { Review } from '@/payload-types'
import Link from 'next/link'

export const TopReviewItem = ({ title, rating, slug }: Review) => {
  return (
    <article className="flex items-center justify-between gap-4 p-4 rounded-lg border border-brand/10 transition-all hover:bg-brand/5 hover:border-brand/30 hover:shadow-sm group">
      <Link href={`/reviews/${slug}`} className="flex-1 min-w-0">
        <h3 className="text-base lg:text-lg font-semibold text-foreground group-hover:text-brand transition-colors line-clamp-2">{title}</h3>
      </Link>
      <div className="shrink-0">
        <Rating rating={rating} />
      </div>
    </article>
  )
}
