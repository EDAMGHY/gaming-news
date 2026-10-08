# Gaming News Roadmap Overview

Last audited against the codebase: **2026-10-08**

## Product Goal

Create a modern gaming publication powered by Payload CMS and Next.js that helps readers follow gaming news, evaluate reviews, and decide what to play next.

The product should not compete only on publishing more headlines. Its strongest opportunity is to connect editorial coverage to a useful games database and give readers decision-making information that broad gaming sites usually split across several products.

## Product Position

- Use `articles` as the main news, feature, guide, and editorial collection.
- Use `reviews` for scored reviews tied to a game.
- Use `games` as the central database that connects releases, reviews, articles, and discovery tools.
- `posts` has been removed from the configured collections and public routes. Do not reintroduce it without a new product decision.
- Build the MVP before growth or monetization work.

## Phase Order

1. **MVP and launch readiness:** complete the public product and close launch blockers.
2. **Growth and differentiation:** improve discovery, editorial depth, trust, and the signature product experience.
3. **Monetization:** add revenue features only after the product is stable, useful, and trustworthy.

## Roadmap Files

- `01-mvp.md`: launch-ready product checklist and current implementation status.
- `02-growth.md`: discovery, editorial, engagement, and differentiation work after MVP.
- `03-monetization.md`: revenue ideas that must wait until the MVP is stable.
- `current-state-and-issues.md`: living technical/product risk register. Add newly discovered issues here and close them with verification evidence.

## Current Strengths

- Payload CMS collections exist for pages, articles, reviews, games, categories, genres, narrative tags, and game lengths.
- Public archive and detail routes exist for articles, reviews, and games.
- Games can be filtered by platform, genre, and narrative tag.
- Homepage blocks exist for featured articles, latest articles, featured reviews, top reviews, upcoming games, and category/genre discovery.
- Search indexes articles and reviews and routes those result types correctly.
- Preview paths exist for pages, articles, reviews, and games.
- Game pages match related reviews through the explicit game relationship.
- Job/cron execution fails closed when no non-empty `CRON_SECRET` is configured.
- Drafts, scheduled publishing, SEO, redirects, forms, and search plugins are configured.
- The frontend already uses shadcn/Radix UI primitives for many controls.

## Main Current Gaps

- The former Next.js security, Card typing, build-verification, and package-manager/Docker launch blockers are verified as resolved; see GN-P0-001 through GN-P0-004.
- Dependency maintenance still includes one upstream high-severity `braces` advisory with no patched release, tracked as GN-P2-011.
- Search does not include games, has no pagination, and has query-state issues.
- Detail-page Open Graph URLs and fallback social images are incorrect.
- Sitemaps omit gaming detail pages and still reference a removed posts sitemap.
- Review pages do not render the stored pros/cons, and archive cards do not show review-specific information.
- Game cards do not expose the useful database fields already stored in Payload.
- Game revalidation and review/game redirect coverage are incomplete.
- Privacy and Terms content is not represented in the repository; About and Contact have seed support but must be verified in the active database.
- The README, admin onboarding, legacy seed content, logo alt text, social image, tests, and some metadata still contain Payload-template leftovers.
- Mobile navigation, filter layouts, hero typography, accessibility, and reduced-motion behavior need a dedicated visual QA pass.
- The current public identity (`Gaming News`) is descriptive but not yet a distinctive brand.

See `current-state-and-issues.md` for evidence, severity, and completion criteria.

## Recommended Differentiation

The recommended signature is a **PlayFit** decision layer on each game page: time commitment, ideal session length, narrative profile, difficulty/complexity, solo/co-op fit, accessibility summary, spoiler-safe themes, localization, and regional availability.

After the PlayFit MVP, add a **Release Ledger** that keeps a sourced timeline of announcements, delays, release changes, major patches, DLC, and server status. This turns scattered articles into a lasting reader resource.

These features should extend the existing `games`, `gameLengths`, and `narrativeTags` models instead of creating unrelated collections prematurely.
