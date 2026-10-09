import type { Article, Game, Page, Review } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { appearanceOnDark } from '@/components/Link/onDark'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { Badge } from '@/components/ui/badge'
import { ButtonLink } from '@/components/ui/button-link'
import { getGameCover, type GameImageSource } from '@/utilities/gameMedia'
import { ArrowUpRight, Gamepad2, Newspaper } from 'lucide-react'
import Link from 'next/link'

type HomeHeroProps = {
  hero: Page['hero']
  layout: Page['layout']
}

type Artwork = {
  game: Game
  image: GameImageSource
}

const isArticle = (value: Article | string): value is Article =>
  typeof value === 'object' && value !== null

const isReview = (value: Review | string): value is Review =>
  typeof value === 'object' && value !== null

const isGame = (value: Game | string | null | undefined): value is Game =>
  typeof value === 'object' && value !== null

const getFeaturedArticles = (layout: Page['layout']): Article[] =>
  layout.flatMap((block) =>
    block.blockType === 'featured-articles' ? (block.articles ?? []).filter(isArticle) : [],
  )

const getFeaturedReviews = (layout: Page['layout']): Review[] =>
  layout.flatMap((block) =>
    block.blockType === 'featuredReviews' ? (block.reviews ?? []).filter(isReview) : [],
  )

const getArtwork = (articles: Article[], reviews: Review[]): Artwork[] => {
  const games = [
    ...articles.flatMap((article) => (article.games ?? []).filter(isGame)),
    ...reviews.map((review) => review.game).filter(isGame),
  ]
  const seen = new Set<string>()

  return games.flatMap((game) => {
    const image = getGameCover(game)
    const key = String(game.id)

    if (!image || seen.has(key)) return []

    seen.add(key)
    return [{ game, image }]
  })
}

export function HomeHero({ hero, layout }: HomeHeroProps) {
  const featuredArticles = getFeaturedArticles(layout)
  const featuredReviews = getFeaturedReviews(layout)
  const artwork = getArtwork(featuredArticles, featuredReviews)
  const leadArticle = featuredArticles[0]
  const primaryArtwork = artwork[0]
  const supportingArtwork = artwork.slice(1, 3)
  const hasHeroLinks = Array.isArray(hero.links) && hero.links.length > 0

  return (
    <section
      className="relative isolate overflow-hidden border-b border-white/10 bg-ink text-white"
      data-block-id="hero"
      data-block-type="homeHero"
      data-theme="dark"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <div className="relative h-[17rem] overflow-hidden sm:h-[21rem] md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[58%]">
        {primaryArtwork ? (
          <Media
            alt={primaryArtwork.game.title}
            fill
            imgClassName="object-cover object-center animate-hero-ken-burns"
            priority
            resource={primaryArtwork.image}
            size="(max-width: 767px) 100vw, 58vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,hsl(var(--brand)/.28),transparent_48%)]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/5 to-black/20 md:bg-[linear-gradient(90deg,#141118_0%,rgba(20,17,24,.88)_17%,rgba(20,17,24,.24)_58%,rgba(20,17,24,.4)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-black/20 md:from-ink/55" />

        {primaryArtwork?.game.slug && (
          <Link
            aria-label={`View ${primaryArtwork.game.title}`}
            className="absolute inset-0 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
            href={`/games/${primaryArtwork.game.slug}`}
          />
        )}

        {supportingArtwork.length > 0 && (
          <div className="absolute bottom-7 right-7 hidden w-[20rem] grid-cols-2 gap-2 xl:grid">
            {supportingArtwork.map(({ game, image }) => (
              <Link
                className="group relative aspect-[16/10] overflow-hidden rounded-md border border-white/25 bg-ink/70 shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                href={`/games/${game.slug ?? ''}`}
                key={game.id}
              >
                <Media
                  alt={game.title}
                  fill
                  imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                  resource={image}
                  size="160px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                <span className="absolute inset-x-3 bottom-2 line-clamp-1 text-xs font-semibold">
                  {game.title}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Container spans the artwork too: let clicks through to the game links, re-enable on the text column */}
      <div className="container pointer-events-none relative z-10">
        <div className="pointer-events-auto flex min-h-[31rem] max-w-[39rem] flex-col justify-center pb-12 pt-5 sm:pb-14 md:min-h-[36rem] md:py-16 lg:max-w-[43rem]">
          <Badge className="mb-5 w-fit border-brand/40 bg-brand/10 px-3 py-1 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-brand hover:bg-brand/10">
            <Gamepad2 aria-hidden="true" className="mr-2 size-3.5" />
            Independent gaming desk
          </Badge>

          {hero.richText ? (
            <RichText
              className="mx-0 mb-0 max-w-none animate-hero-fade-up md:max-w-none [&_:is(h1,h2,h3)]:max-w-[12ch] [&_:is(h1,h2,h3)]:text-balance [&_:is(h1,h2,h3)]:text-[2.65rem] [&_:is(h1,h2,h3)]:font-black [&_:is(h1,h2,h3)]:leading-[0.95] [&_:is(h1,h2,h3)]:tracking-[-0.025em] [&_:is(h1,h2,h3)]:text-white sm:[&_:is(h1,h2,h3)]:text-5xl lg:[&_:is(h1,h2,h3)]:text-[4.25rem] [&_p]:mt-5 [&_p]:max-w-[34rem] [&_p]:text-base [&_p]:leading-7 [&_p]:text-white/70 sm:[&_p]:text-lg"
              data={hero.richText}
              enableGutter={false}
            />
          ) : (
            <div className="animate-hero-fade-up">
              <h1 className="max-w-[12ch] text-balance text-[2.65rem] font-black leading-[0.95] tracking-[-0.025em] sm:text-5xl lg:text-[4.25rem]">
                Your front row seat to gaming
              </h1>
              <p className="mt-5 max-w-[34rem] text-base leading-7 text-white/68 sm:text-lg">
                Breaking news, honest reviews, and the biggest upcoming releases—all in one place.
              </p>
            </div>
          )}

          {hasHeroLinks ? (
            <ul className="mt-7 flex flex-wrap gap-3 animate-hero-fade-up-delay">
              {hero.links?.map(({ link }, index) => (
                <li key={index}>
                  <CMSLink
                    {...link}
                    appearance={appearanceOnDark(
                      link.appearance,
                      index === 0 ? 'primary' : 'glass',
                    )}
                    size="lg"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-7 flex flex-wrap gap-3 animate-hero-fade-up-delay">
              <ButtonLink href="/articles" size="lg" variant="primary">
                Read articles
              </ButtonLink>
              <ButtonLink href="/games" size="lg" variant="glass">
                Browse games
              </ButtonLink>
            </div>
          )}

          {leadArticle?.slug && (
            <Link
              className="group mt-9 grid max-w-[35rem] grid-cols-[auto_1fr_auto] items-center gap-3 border-t border-white/15 pt-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              href={`/articles/${leadArticle.slug}`}
            >
              <span className="grid size-9 place-items-center rounded-md bg-white/10 text-brand">
                <Newspaper aria-hidden="true" className="size-4" />
              </span>
              <span>
                <span className="block font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/45">
                  Lead story
                </span>
                <span className="mt-1 block line-clamp-1 text-sm font-semibold text-white/90 sm:text-base">
                  {leadArticle.title}
                </span>
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 text-brand transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
