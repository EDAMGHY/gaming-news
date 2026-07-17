# Phase 1: MVP

## MVP Goal

Launch a coherent minimal gaming news website with articles, reviews, game pages, search, SEO, and essential pages.

The MVP should be small, but it should not feel broken or like a generic template.

## 1. Clean Product Direction

- [ ] Decide what to do with `posts`.
- [ ] Option A: remove `posts` from public navigation and stop using it.
- [ ] Option B: repurpose `posts` as short blog/editorial updates.
- [ ] Option C: rename conceptually to `news`, but only after considering migration impact.
- [ ] Use `articles` as the main news/editorial content type for MVP.
- [ ] Keep `reviews` for scored game reviews.
- [ ] Keep `games` as the game database.

## 2. Public Routes

- [ ] Keep `/articles` archive.
- [ ] Keep `/articles/[slug]` detail pages.
- [ ] Keep `/reviews` archive.
- [ ] Keep `/reviews/[slug]` detail pages.
- [ ] Add `/games` archive page.
- [ ] Add `/games/[slug]` detail page.
- [ ] Keep `/search` page.
- [ ] Add or create CMS pages for `/about`.
- [ ] Add or create CMS pages for `/contact`.
- [ ] Add or create CMS pages for `/privacy`.
- [ ] Add or create CMS pages for `/terms`.

## 3. Game Pages

- [ ] Build a games archive page listing published games.
- [ ] Show game cover image, title, release date, platforms, genres, and developer/publisher on game cards.
- [ ] Build a game detail page.
- [ ] On game detail pages, show cover image, release date, platforms, genres, narrative tags, game length, developer, and publisher.
- [ ] Add related reviews to game detail pages when available.
- [ ] Add related articles to game detail pages later if simple enough for MVP.

## 4. Homepage MVP Sections

- [ ] Configure homepage with featured articles.
- [ ] Configure homepage with latest articles/news.
- [ ] Configure homepage with featured reviews.
- [ ] Configure homepage with top reviews.
- [ ] Configure homepage with upcoming games.
- [ ] Make sure each homepage section links to its archive page.
- [ ] Avoid showing empty homepage sections when no content exists.

## 5. Search

- [ ] Update Payload search plugin to index `articles`.
- [ ] Update Payload search plugin to index `reviews`.
- [ ] Decide whether `games` should be searchable in MVP.
- [ ] Update search results so article results link to `/articles/[slug]`.
- [ ] Update search results so review results link to `/reviews/[slug]`.
- [ ] Update search results so game results link to `/games/[slug]` if games are indexed.
- [ ] Stop treating all search results as `posts`.

## 6. SEO And Metadata

- [ ] Replace `Payload Website Template` metadata with project branding.
- [ ] Set a real site name.
- [ ] Set default Open Graph title, description, and image.
- [ ] Update article archive metadata.
- [ ] Update review archive metadata.
- [ ] Add game archive metadata.
- [ ] Fix SEO generated URLs so articles use `/articles/[slug]`.
- [ ] Fix SEO generated URLs so reviews use `/reviews/[slug]`.
- [ ] Fix SEO generated URLs so games use `/games/[slug]`.
- [ ] Make Twitter metadata use the site account or remove template account references.

## 7. Sitemaps

- [ ] Keep pages sitemap.
- [ ] Add articles sitemap or update sitemap generation to include articles.
- [ ] Add reviews sitemap or update sitemap generation to include reviews.
- [ ] Add games sitemap or update sitemap generation to include games.
- [ ] Remove `/posts` from sitemap if posts are no longer public.
- [ ] Include `/articles`, `/reviews`, `/games`, and `/search` in static sitemap entries.

## 8. Preview And Revalidation

- [ ] Fix preview path generation for `articles`.
- [ ] Fix preview path generation for `reviews`.
- [ ] Fix preview path generation for `games`.
- [ ] Confirm article publishing revalidates article detail and archive pages.
- [ ] Confirm review publishing revalidates review detail and archive pages.
- [ ] Add game revalidation hooks if missing.
- [ ] Confirm homepage revalidates when homepage content changes.

## 9. Navigation And Footer

- [ ] Header should include Articles, Reviews, Games, and Search.
- [ ] Footer should include About, Contact, Privacy, and Terms.
- [ ] Remove or hide generic `/posts` navigation unless intentionally used.
- [ ] Keep navigation simple for MVP.

## 10. Content Requirements Before Launch

- [ ] Add at least 5 published articles.
- [ ] Add at least 3 published reviews.
- [ ] Add at least 8 published games.
- [ ] Add categories for common sections like News, Reviews, Guides, Features, Industry.
- [ ] Add genres such as RPG, Action, Adventure, Shooter, Strategy, Sports, Indie.
- [ ] Add platforms such as PC, PS5, Xbox Series, Switch, Switch 2, Mobile.
- [ ] Add real hero/meta images for key content.

## 11. Template Cleanup

- [ ] Update README to describe this gaming news project.
- [ ] Remove visible references to Payload Website Template from public pages.
- [ ] Update admin welcome/onboarding text if it still references template content.
- [ ] Review seed content and remove generic starter copy from public-facing flows.

## 12. MVP Acceptance Criteria

- [ ] A visitor can browse latest articles.
- [ ] A visitor can read article detail pages.
- [ ] A visitor can browse reviews.
- [ ] A visitor can read review detail pages with score/pros/cons.
- [ ] A visitor can browse games.
- [ ] A visitor can view game detail pages.
- [ ] Search returns relevant gaming content.
- [ ] Public pages have non-template metadata.
- [ ] Sitemaps include the public gaming routes.
- [ ] Header and footer navigation make sense.
- [ ] Site can be built successfully.
