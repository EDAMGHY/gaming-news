import type { Article, Game, Media as MediaType, Review } from '@/payload-types'

import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import {
  Card as CardRoot,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/utilities/ui'
import { getGameCover, type GameImageSource } from '@/utilities/gameMedia'
import { format } from 'date-fns'
import { ArrowUpRight, CalendarDays, Clock3, Gamepad2 } from 'lucide-react'
import Link from 'next/link'

type CardMeta = {
  description?: string | null
  image?: MediaType | string | null
}

export type ArticleCardData = Partial<
  Pick<
    Article,
    | 'categories'
    | 'heroImage'
    | 'id'
    | 'games'
    | 'meta'
    | 'populatedAuthors'
    | 'publishedAt'
    | 'slug'
    | 'title'
  >
> & { meta?: CardMeta }

export type ReviewCardData = Partial<
  Pick<
    Review,
    | 'categories'
    | 'excerpt'
    | 'game'
    | 'heroImage'
    | 'hoursPlayed'
    | 'id'
    | 'meta'
    | 'platformTested'
    | 'publishedAt'
    | 'rating'
    | 'slug'
    | 'title'
  >
> & { meta?: CardMeta }

export type GameCardData = Partial<
  Pick<
    Game,
    | 'coverImage'
    | 'developer'
    | 'externalCoverUrl'
    | 'genres'
    | 'id'
    | 'meta'
    | 'platforms'
    | 'publisher'
    | 'releaseDate'
    | 'slug'
    | 'title'
  >
> & { meta?: CardMeta }

const platformLabels: Record<string, string> = {
  pc: 'PC',
  ps5: 'PS5',
  ps4: 'PS4',
  'xbox-series': 'Xbox Series',
  'xbox-one': 'Xbox One',
  switch: 'Switch',
  'switch-2': 'Switch 2',
  mobile: 'Mobile',
}

const getImage = (...resources: unknown[]): MediaType | undefined =>
  resources.find(
    (resource): resource is MediaType =>
      typeof resource === 'object' && resource !== null && 'id' in resource,
  )

const getCategoryNames = (categories: ArticleCardData['categories']): string[] =>
  (categories ?? [])
    .map((category) => (typeof category === 'object' ? category.title : null))
    .filter((category): category is string => Boolean(category))

const getGenreNames = (genres: GameCardData['genres']): string[] =>
  (genres ?? [])
    .map((genre) => (typeof genre === 'object' ? genre.name : null))
    .filter((genre): genre is string => Boolean(genre))

const getGameName = (game: ReviewCardData['game']): string | undefined =>
  typeof game === 'object' && game !== null ? game.title : undefined

const CardImage = ({
  alt,
  className,
  image,
  sizes,
}: {
  alt: string
  className?: string
  image?: GameImageSource
  sizes: string
}) => (
  <div className={cn('relative overflow-hidden bg-muted', className)}>
    <Media
      alt={alt}
      fill
      imgClassName="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
      resource={image}
      size={sizes}
    />
  </div>
)

const cardClassName =
  'group flex h-full flex-col overflow-hidden border-border/70 bg-card/90 shadow-none transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-foreground/25 hover:shadow-[0_18px_40px_-24px_hsl(270_14%_8%/0.45)] focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 focus-within:ring-offset-background'

export function ArticleCard({
  article,
  className,
}: {
  article: ArticleCardData
  className?: string
}) {
  const linkedGame = article.games?.find(
    (game): game is Game => typeof game === 'object' && game !== null,
  )
  const image =
    getImage(article.heroImage, article.meta?.image) ||
    (linkedGame ? getGameCover(linkedGame) : undefined)
  const categories = getCategoryNames(article.categories)
  const description = article.meta?.description?.replace(/\s/g, ' ')
  const author = article.populatedAuthors?.find((item) => item.name)?.name

  return (
    <Link
      className="block h-full rounded-lg focus:outline-none"
      href={`/articles/${article.slug ?? ''}`}
    >
      <CardRoot className={cn(cardClassName, className)}>
        <CardImage
          alt={article.title ?? ''}
          className="aspect-[16/10]"
          image={image}
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
        />
        <CardHeader className="gap-3 space-y-0 p-5 pb-3">
          <div className="flex min-h-6 flex-wrap items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 text-foreground">
              <span aria-hidden="true" className="size-2 rounded-full bg-glyph-news" /> Story
            </span>
            {categories[0] && <span>· {categories[0]}</span>}
            {article.publishedAt && (
              <time dateTime={article.publishedAt}>
                · {format(new Date(article.publishedAt), 'MMM d')}
              </time>
            )}
          </div>
          <CardTitle className="text-balance text-xl font-extrabold leading-[1.1] tracking-[-0.015em] transition-colors group-hover:text-brand">
            {article.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          {description && (
            <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{description}</p>
          )}
        </CardContent>
        <CardFooter className="mt-auto justify-between border-t border-border/60 p-5 font-mono text-xs text-muted-foreground">
          <span>{author ? `By ${author}` : 'News desk'}</span>
          <span className="inline-flex items-center gap-1 text-foreground">
            Read <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </span>
        </CardFooter>
      </CardRoot>
    </Link>
  )
}

export function ReviewCard({ className, review }: { className?: string; review: ReviewCardData }) {
  const linkedGame =
    typeof review.game === 'object' && review.game !== null ? review.game : undefined
  const image =
    getImage(review.heroImage, review.meta?.image) ||
    (linkedGame ? getGameCover(linkedGame) : undefined)
  const game = getGameName(review.game)
  const hasRating = review.rating !== null && review.rating !== undefined

  return (
    <Link
      className="block h-full rounded-lg focus:outline-none"
      href={`/reviews/${review.slug ?? ''}`}
    >
      <CardRoot className={cn(cardClassName, 'relative', className)}>
        <CardImage
          alt={review.title ?? ''}
          className="aspect-[16/9]"
          image={image}
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
        />
        {hasRating && (
          <div className="absolute right-4 top-4 grid size-16 place-items-center rounded-md bg-quest text-center text-ink shadow-[inset_0_-3px_0_hsl(270_14%_8%/0.2),0_10px_30px_-10px_hsl(270_14%_8%/0.6)]">
            <div>
              <span className="block font-display text-[1.75rem] font-black leading-none">
                {review.rating}
              </span>
              <span className="font-mono text-[0.55rem] uppercase tracking-wider text-ink/70">
                out of 5
              </span>
            </div>
          </div>
        )}
        <CardHeader className="gap-3 space-y-0 p-5 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-[0.16em]">
              <span aria-hidden="true" className="size-2 rounded-full bg-glyph-review" /> Review
            </span>
            {game && <span className="text-sm font-medium text-muted-foreground">{game}</span>}
          </div>
          <CardTitle className="text-balance text-xl font-extrabold leading-[1.1] tracking-[-0.015em] transition-colors group-hover:text-brand">
            {review.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          {(review.excerpt || review.meta?.description) && (
            <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
              {review.excerpt || review.meta?.description}
            </p>
          )}
        </CardContent>
        <CardFooter className="mt-auto flex-wrap gap-x-4 gap-y-2 border-t border-border/60 p-5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">
          {review.platformTested && (
            <span className="inline-flex items-center gap-1.5">
              <Gamepad2 aria-hidden="true" className="size-3.5 text-brand" />
              {platformLabels[review.platformTested] ?? review.platformTested}
            </span>
          )}
          {review.hoursPlayed !== null && review.hoursPlayed !== undefined && (
            <span className="inline-flex items-center gap-1.5">
              <Clock3 aria-hidden="true" className="size-3.5 text-brand" />
              {review.hoursPlayed}h played
            </span>
          )}
          <span className="ml-auto inline-flex items-center gap-1 text-foreground">
            Read <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </span>
        </CardFooter>
      </CardRoot>
    </Link>
  )
}

export function GameCard({ game, className }: { game: GameCardData; className?: string }) {
  const image = getGameCover(game) || getImage(game.meta?.image)
  const genres = getGenreNames(game.genres)
  const platforms = game.platforms ?? []

  return (
    <Link className="block h-full rounded-lg focus:outline-none" href={`/games/${game.slug ?? ''}`}>
      <CardRoot className={cn(cardClassName, className)}>
        <CardImage
          alt={game.title ?? ''}
          className="aspect-[4/5]"
          image={image}
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
        />
        <CardHeader className="gap-3 space-y-0 p-5 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              aria-label="Game"
              className="size-2 rounded-full bg-glyph-game"
              role="img"
            />
            {genres.slice(0, 2).map((genre) => (
              <Badge
                className="font-mono text-[0.65rem] uppercase tracking-wider"
                key={genre}
                variant="outline"
              >
                {genre}
              </Badge>
            ))}
          </div>
          <CardTitle className="text-balance text-xl font-extrabold leading-[1.1] tracking-[-0.015em] transition-colors group-hover:text-brand">
            {game.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-5 pt-0 text-sm text-muted-foreground">
          {game.releaseDate && (
            <div className="flex items-center gap-2">
              <CalendarDays aria-hidden="true" className="size-4 text-brand" />
              <time dateTime={game.releaseDate}>
                {format(new Date(game.releaseDate), 'MMM d, yyyy')}
              </time>
            </div>
          )}
          {platforms.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {platforms.slice(0, 4).map((platform) => (
                <span
                  className="rounded border border-border px-2 py-1 font-mono text-[0.65rem] uppercase"
                  key={platform}
                >
                  {platformLabels[platform] ?? platform}
                </span>
              ))}
              {platforms.length > 4 && (
                <span className="px-1 py-1 text-xs">+{platforms.length - 4}</span>
              )}
            </div>
          )}
        </CardContent>
        {(game.developer || game.publisher) && (
          <CardFooter className="mt-auto grid grid-cols-2 gap-4 border-t border-border/60 p-5 text-xs">
            <div>
              <span className="block font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
                Developer
              </span>
              <span className="mt-1 block line-clamp-2 font-medium">{game.developer || '—'}</span>
            </div>
            <div>
              <span className="block font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
                Publisher
              </span>
              <span className="mt-1 block line-clamp-2 font-medium">{game.publisher || '—'}</span>
            </div>
          </CardFooter>
        )}
      </CardRoot>
    </Link>
  )
}
