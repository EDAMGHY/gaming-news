import type { Metadata } from 'next'

import type { Media, Page, Article, Game, Review, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { siteConfig } from '@/config/site'

const toAbsoluteURL = (url: string, serverUrl: string): string =>
  /^https:\/\//i.test(url) ? url : serverUrl + url

const getImageURL = (
  image?: Media | Config['db']['defaultIDType'] | null,
  externalFallback?: string | null,
) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    if (image.url) url = toAbsoluteURL(image.url, serverUrl)
  } else if (externalFallback) {
    url = toAbsoluteURL(externalFallback, serverUrl)
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Article> | Partial<Game> | Partial<Review> | null
}): Promise<Metadata> => {
  const { doc } = args

  const externalCoverUrl =
    doc && 'externalCoverUrl' in doc && typeof doc.externalCoverUrl === 'string'
      ? doc.externalCoverUrl
      : doc && 'game' in doc && typeof doc.game === 'object' && doc.game
        ? doc.game.externalCoverUrl
        : doc && 'games' in doc
          ? doc.games?.find((game) => typeof game === 'object')?.externalCoverUrl
          : undefined
  const ogImage = getImageURL(doc?.meta?.image, externalCoverUrl)

  const editorialTitle = doc?.meta?.title?.replace(/\s*\|\s*Payload Website Template/gi, '').trim()
  const title = editorialTitle ? editorialTitle + ` | ${siteConfig.name}` : siteConfig.name

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
