import { Rating } from '@/components/Rating/Rating'
import { Review } from '@/payload-types'
import Link from 'next/link'

export const TopReviewItem = ({ title, rating, slug }: Review) => {
  return (
    <article className="flex items-center justify-between gap-2 p-3">
      <Link href={`/reviews/${slug}`} className="hover:underline underline-offset-4">
        <h3 className="text-lg capitalize font-semibold">{title}</h3>
      </Link>
      <Rating rating={rating} />
    </article>
  )
}
