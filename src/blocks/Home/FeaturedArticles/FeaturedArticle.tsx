import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { Article } from '@/payload-types'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const FeaturedArticle = ({ meta, title, slug, content }: Article) => {
  return (
    <div className="relative border border-border w-full rounded-[8px] overflow-hidden">
      <Media className="w-full !aspect-video" fill resource={meta?.image} addClasses />
      <div className="w-[calc(100%-32px)] absolute rounded-lg p-4 bg-black/80 bottom-4 left-4 space-y-2">
        {title && <h2 className="text-2xl text-white font-semibold">{title}</h2>}
        {content && (
          <RichText
            enableGutter={false}
            className="px-0 text-sm text-white/70 mb-0 line-clamp-2"
            data={content}
          />
        )}
        <Button asChild variant="outline">
          <Link href={`/articles/${slug}`}>View Article</Link>
        </Button>
      </div>
    </div>
  )
}
