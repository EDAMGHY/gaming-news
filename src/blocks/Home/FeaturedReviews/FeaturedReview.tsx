import { Media } from '@/components/Media'
import { Review } from '@/payload-types'
import { formatRelativeDate } from '@/utilities/date'
import Link from 'next/link'

export const FeaturedReview = ({ title, excerpt, createdAt, heroImage, rating, slug }: Review) => {
  return (
    <Link href={`/reviews/${slug}`}>
      <article className="flex lg:flex-row flex-col items-start lg:items-center justify-start gap-6 p-4 rounded-lg transition-all hover:bg-brand/5 hover:border hover:border-brand/20 group">
        <Media
          className="w-full shrink-0 aspect-video lg:max-w-[220px] max-w-full"
          fill
          pictureClassName="relative w-full h-full rounded-md block object-cover group-hover:shadow-lg transition-shadow"
          resource={heroImage}
        />

        <div className="space-y-3 flex-1 w-full">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3 flex-1">
              <time className="text-xs font-medium text-brand/80 uppercase tracking-wide" dateTime={createdAt}>
                {formatRelativeDate(createdAt)}
              </time>

              <h3 className="text-xl lg:text-2xl font-bold text-foreground group-hover:text-brand transition-colors line-clamp-2">{title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{excerpt}</p>
            </div>

            <div className="shrink-0 flex flex-col items-center justify-center bg-brand/10 rounded-lg p-3 min-w-[60px]">
              <span className="text-2xl font-bold text-brand">{rating}</span>
              <span className="text-xs text-muted-foreground">/5</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
