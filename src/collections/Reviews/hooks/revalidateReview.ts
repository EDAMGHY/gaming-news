import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Review } from '../../../payload-types'

export const revalidateReview: CollectionAfterChangeHook<Review> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/reviews/${doc.slug}`

      payload.logger.info(`Revalidating review at path: ${path}`)

      revalidatePath(path)
      revalidateTag('reviews-sitemap')
    }

    // If the review was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/reviews/${previousDoc.slug}`

      payload.logger.info(`Revalidating old review at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('reviews-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Review> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/reviews/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('reviews-sitemap')
  }

  return doc
}
