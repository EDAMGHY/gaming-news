# Phase 1: MVP

Last audited against the codebase: **2026-10-08**

## Status Legend

- `[x]` is implemented and confirmed in the current code.
- `[ ]` is incomplete, requires runtime/content verification, or has a known defect.
- A **Partial** note describes code that exists but does not yet meet the acceptance criterion.

## MVP Goal

Launch a coherent gaming publication with articles, reviews, game pages, search, SEO, trust pages, and a reliable mobile experience.

The MVP should be small, but it must build successfully, be secure, and not feel like a generic Payload template.

## 0. Launch Blockers

- [x] Upgrade Next.js from the vulnerable `15.4.4` release to a supported patched release compatible with Payload. **Verified:** Next.js 16.3.8, React 19.3.0, and Payload 3.90.2 build and test successfully.
- [x] Fix the TypeScript error in the shared card image resource.
- [x] Produce a successful production build.
- [x] Run updated integration and end-to-end tests in a disposable/test environment. **Verified:** 12 integration tests and 8 desktop/mobile E2E tests pass.
- [x] Resolve or consciously baseline the current ESLint warnings. **Baseline:** 0 errors and 41 visible warnings, tracked by GN-P2-007.
- [x] Choose one package manager, keep its lockfile, and make local, CI, and Docker usage consistent. **Choice:** pnpm 10.28.2.
- [x] Fix Docker standalone-output configuration or remove the unsupported Docker path. **Verified:** clean image build and HTTP 200 from `/games` in an ephemeral container.

## 1. Clean Product Direction

- [x] Remove `posts` from configured collections and public routes.
- [x] Use `articles` as the main news/editorial content type.
- [x] Keep `reviews` for scored game reviews.
- [x] Keep `games` as the central game database.
- [ ] Decide the final public brand name; `Gaming News` is still a placeholder-level identity.

## 2. Public Routes

- [x] Keep `/articles` archive.
- [x] Keep `/articles/[slug]` detail pages.
- [x] Keep `/reviews` archive.
- [x] Keep `/reviews/[slug]` detail pages.
- [x] Add `/games` archive page.
- [x] Add `/games/[slug]` detail page.
- [x] Keep `/search` page.
- [ ] Publish and verify `/about`. **Partial:** a dedicated seed script exists.
- [ ] Publish and verify `/contact`. **Partial:** the default seed contains a contact page and form.
- [ ] Add and publish `/privacy`.
- [ ] Add and publish `/terms`.
- [ ] Add `/editorial-policy` and `/review-policy` before presenting the publication as an expert/trusted source.
- [ ] Add a corrections and disclosures page or combine these policies clearly with the editorial policy.

## 3. Game Pages

- [x] Build a games archive that lists published games.
- [x] Show cover, title, release date, platforms, genres, and developer/publisher on game cards.
- [x] Build a game detail page.
- [x] Show cover, release date, platforms, genres, narrative tags, game length, developer, publisher, synopsis, screenshots, and related games when populated.
- [x] Show reviews for the current game. **Verified:** the query matches the explicit game relationship, with regression coverage for zero, one, and multiple reviews.
- [x] Add related articles to game pages using an explicit article-to-games relationship.
- [ ] Add breadcrumbs and structured `VideoGame`/`BreadcrumbList` data.

## 4. Review Pages

- [x] Build review archive and detail routes.
- [x] Store a score, excerpt, game relationship, pros, cons, author, and body content in the CMS model.
- [x] Render the review score, excerpt, game, and useful summary information on review archive cards.
- [x] Render the stored pros and cons on review detail pages.
- [x] Add a clear verdict/summary box near the top of a review.
- [x] Display platform tested, hours played, review-copy disclosure, and game version/patch tested.
- [x] Ensure a valid score of `0` is still rendered instead of being hidden by truthy checks.
- [ ] Add review structured data and an explicit scoring-policy link.

## 5. Article Pages

- [x] Build article archive and detail routes.
- [x] Support categories, authors, publication dates, rich text, media, code, banners, and related articles.
- [ ] Add an article excerpt/dek that is independent from SEO description.
- [ ] Add reading time and updated/corrected timestamps.
- [ ] Add source/citation fields for reporting and a visible source treatment.
- [ ] Add Article/NewsArticle and breadcrumb structured data.
- [ ] Remove debug logging from the article query.

## 6. Homepage MVP Sections

- [ ] Configure and verify featured articles in the active CMS homepage. **Partial:** the block and seed configuration exist.
- [ ] Configure and verify latest articles/news. **Partial:** an automatic latest-articles block exists.
- [ ] Configure and verify featured reviews. **Partial:** the block and seed configuration exist.
- [ ] Configure and verify top reviews. **Partial:** the automatic block exists.
- [ ] Configure and verify upcoming games. **Partial:** the automatic block and fallback query exist.
- [x] Ensure every homepage section has a valid archive/discovery link.
- [x] Avoid empty homepage sections.
- [x] Verify the homepage at mobile, tablet, laptop, and wide-desktop breakpoints. **Verified 2026-10-08:** manual browser QA at mobile, 768px tablet, and 1440px desktop plus the desktop/Pixel 7 overflow suite.

## 7. Search

- [x] Index `articles`.
- [x] Index `reviews`.
- [ ] Add `games` to search for the MVP; the games database is a core public feature.
- [x] Route article results to `/articles/[slug]`.
- [x] Route review results to `/reviews/[slug]`.
- [ ] Route game results to `/games/[slug]` after games are indexed.
- [x] Stop treating every result as a post.
- [ ] Preserve and display the current query when loading or sharing `/search?q=...`.
- [ ] Build query strings with `URLSearchParams` instead of raw interpolation.
- [ ] Add pagination or intentional load-more behavior beyond the current 12-result cap.
- [ ] Show result type, relevant metadata, and a useful empty state.

## 8. SEO And Metadata

- [ ] Remove all `Payload Website Template` metadata/assets. **Partial:** general site metadata is branded, but the fallback OG asset remains `website-template-OG.webp`.
- [ ] Set the final site name, description, canonical production URL, and social accounts.
- [ ] Create a branded default Open Graph image.
- [x] Add article archive metadata.
- [x] Add review archive metadata.
- [x] Add game archive metadata.
- [ ] Fix frontend detail-page Open Graph URLs; current string slugs resolve their OG URL to `/`.
- [x] Generate correct admin SEO preview URLs for articles, reviews, games, and pages.
- [ ] Add canonical URLs and appropriate index/noindex behavior for filtered and search pages.
- [ ] Add Article/NewsArticle, Review, VideoGame, BreadcrumbList, Organization, and WebSite/SearchAction structured data where appropriate.
- [ ] Remove the placeholder `@gamingnews` account unless it is owned by the project.

## 9. Sitemaps And Feeds

- [x] Keep the pages sitemap route.
- [ ] Add published article detail URLs.
- [ ] Add published review detail URLs.
- [ ] Add published game detail URLs.
- [ ] Include `/articles`, `/reviews`, `/games`, `/search`, and required trust pages intentionally.
- [ ] Remove the nonexistent `posts-sitemap.xml` reference and remaining `/posts` rules.
- [ ] Normalize production URL handling so Vercel hostnames receive an `https://` scheme.
- [ ] Add an RSS/Atom feed for articles/news.
- [ ] Consider a dedicated Google News sitemap only after a consistent news publishing operation exists.

## 10. Preview, Revalidation, And Redirects

- [x] Generate preview paths for articles.
- [x] Generate preview paths for reviews.
- [x] Generate preview paths for games.
- [x] Generate preview paths for CMS pages.
- [ ] Revalidate article detail, archive, homepage blocks, and sitemap entries when publishing/unpublishing or changing slugs. **Partial:** detail and a nonexistent sitemap tag are currently revalidated.
- [ ] Revalidate review detail, archive, homepage blocks, related game pages, and sitemap entries. **Partial:** detail and a nonexistent sitemap tag are currently revalidated.
- [ ] Add game revalidation hooks for detail, archive, homepage blocks, related reviews, and sitemap entries.
- [ ] Add redirect support for review and game documents, not only pages and articles.
- [ ] Verify homepage revalidation when referenced or automatically queried content changes.

## 11. Navigation And Footer

- [x] Provide header navigation support for Articles, Reviews, Games, and Search.
- [ ] Verify the active CMS header contains Articles, Reviews, Games, and Search.
- [ ] Footer must contain About, Contact, Privacy, Terms, Editorial Policy, and Review Policy.
- [x] Remove the public `/posts` navigation path.
- [ ] Remove seeded links to `/admin`, the Payload template source, and Payload marketing from the public footer.
- [ ] Add active navigation states and make the mobile menu close on navigation.
- [ ] Rebuild the mobile menu with accessible focus management, Escape handling, scroll locking, and `aria-expanded`/`aria-controls`—prefer the existing shadcn Sheet/Dialog primitives.

## 12. Accessibility And Responsive Quality

- [ ] Make media alt text required where an image communicates content.
- [ ] Replace `alt="Payload Logo"` with the real publication name.
- [ ] Give review ratings an accessible text label, not only star icons.
- [ ] Add visible focus states and verify keyboard navigation for menus, filters, galleries, pagination, and lightboxes.
- [ ] Respect reduced-motion preferences for all glow, slide, shimmer, and hover-scale animations.
- [ ] Verify long hero titles do not overflow on narrow phones.
- [ ] Make archive search/filter controls wrap or collapse cleanly on mobile.
- [ ] Verify color contrast in light and dark themes and correct the dark theme border token if invalid.
- [ ] Add an accessibility statement and contact route for reporting accessibility issues.

## 13. Performance And Reliability

- [ ] Verify production media persistence. **Partial:** game artwork now uses validated RAWG URLs with local editorial overrides, new local uploads retain only an original and admin thumbnail, and the standalone Docker path prepares a writable `/app/public/media` mount; the Dokploy volume import and container-restart check remain.
- [ ] Replace the unoptimized related-game `<img>` with the shared Media/Next Image component.
- [ ] Use responsive `sizes` values appropriate to each card/hero instead of a generic fallback.
- [ ] Avoid loading up to 1,000 full facet records per archive request; replace with a scalable facet/count strategy.
- [ ] Review Payload query depth and selected fields to avoid over-fetching.
- [ ] Add route-level loading and error states.
- [ ] Add rate limiting and spam protection for public forms before launch.
- [x] Ensure job/cron authorization denies requests safely when `CRON_SECRET` is missing. **Verified:** absent, empty, and whitespace-only secrets deny unauthenticated requests; valid bearer and authenticated-user paths are covered.

## 14. Content Requirements Before Launch

- [ ] Verify at least 5 published articles in the production database.
- [ ] Verify at least 3 published reviews.
- [ ] Verify at least 8 published games.
- [ ] Add/verify categories such as News, Guides, Features, Opinion, Industry, and Previews. Reviews can remain a content type rather than relying only on a category.
- [ ] Add/verify genres such as RPG, Action, Adventure, Shooter, Strategy, Sports, and Indie.
- [x] The game model supports PC, PS5, PS4, Xbox Series, Xbox One, Switch, Switch 2, and Mobile.
- [ ] Add real hero, cover, screenshot, and social images with descriptive alt text.
- [ ] Replace generic/template seed stories before production use.

## 15. Template And Documentation Cleanup

- [ ] Rewrite the README for this product.
- [ ] Remove visible Payload-template references from public pages, assets, tests, and seeded globals.
- [ ] Replace the generic admin welcome/onboarding instructions.
- [ ] Choose a single seed workflow and clearly separate demo data from production content.
- [x] Update the roadmap to reflect the removal of posts and the addition of game routes/search/homepage work.
- [x] Keep `current-state-and-issues.md` updated whenever an issue is found, fixed, reopened, or verified.

## 16. MVP Acceptance Criteria

Do not mark these complete from file presence alone. Verify them against a running production build with representative published content.

- [ ] A visitor can browse and filter latest articles on mobile and desktop.
- [ ] A visitor can read article details with correct metadata, author, date, sources, and related content.
- [ ] A visitor can browse reviews and see score, game, platform, and summary information.
- [ ] A visitor can read a review with score, verdict, pros, cons, disclosure, and related game.
- [ ] A visitor can browse and filter games using useful database information.
- [ ] A visitor can view a game with accurate related reviews and articles.
- [ ] Global search returns paginated articles, reviews, and games with correct destinations.
- [ ] Public pages have branded metadata, canonical URLs, social images, and structured data.
- [ ] Sitemaps contain every intended indexable public route and no removed template routes.
- [ ] Header, footer, mobile navigation, trust pages, and 404 behavior make sense.
- [ ] Forms are protected from spam and handle success/error states accessibly.
- [ ] TypeScript, lint, production build, integration tests, and end-to-end tests pass.
- [ ] No P0 or P1 issue remains open in `current-state-and-issues.md`.
