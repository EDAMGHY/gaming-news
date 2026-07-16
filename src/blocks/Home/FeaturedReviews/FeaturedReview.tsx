import { Media } from '@/components/Media'
import { Review } from '@/payload-types'
import { formatRelativeDate } from '@/utilities/date'

export const FeaturedReview = ({ title, excerpt, createdAt, heroImage, rating }: Review) => {
  return (
    <article className="flex lg:flex-row flex-col items-center justify-start gap-4">
      <Media
        className="w-full shrink-0 aspect-video lg:max-w-[200px] max-w-full"
        fill
        pictureClassName="relative w-full h-full rounded block"
        resource={heroImage}
      />

      <div className="space-y-2 w-full">
        <time className="text-sm text-gray-600" dateTime={createdAt}>
          {formatRelativeDate(createdAt)}
        </time>

        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="text-sm text-foreground">{excerpt}</p>
      </div>

      <span className="w-fit shrink-0 inline-lex justify-center items-center gap-3 text-4xl">
        {rating}
        <span className="inline-block text-xl">/5</span>
      </span>
    </article>
  )
}
