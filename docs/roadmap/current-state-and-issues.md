# Current State And Issue Register

Last audited: **2026-10-08**

## Purpose

This is the living source of truth for known technical, product, content, accessibility, and operational issues.

When a new issue is discovered:

1. Add it with a stable ID, severity, evidence, and completion criteria.
2. Set its status to `Open`, `In progress`, `Blocked`, `Fixed`, or `Verified`.
3. Do not mark it `Verified` until the relevant check, build, test, or manual QA passes.
4. Keep resolved issues in this file so decisions and regressions remain traceable.
5. Update `00-overview.md` or the phase roadmaps when an issue changes product scope or priority.

## Severity Definitions

- **P0 — Launch blocker:** security exposure, failed build, data/access risk, or a broken core journey.
- **P1 — Must fix for MVP:** materially incorrect behavior, discoverability failure, trust problem, or missing MVP requirement.
- **P2 — Important improvement:** accessibility, mobile, performance, maintainability, or editorial-quality weakness.
- **P3 — Later enhancement:** useful work that should not displace MVP completion.

## Verification Snapshot

The gaming content and homepage experience was verified on **2026-10-08** from branch
`codex/gaming-content-homepage`.

- `pnpm exec tsc --noEmit --incremental false`: **passed**.
- `pnpm lint`: **passed with 0 errors and 34 warnings** (down from the 41-warning baseline).
- `pnpm build`: **passed** on Next.js 16.3.8.
- `pnpm test:int`: **passed, 4/4 tests**.
- Production-preview Playwright run: **passed, 8/8 desktop/mobile route and overflow tests**.
- Manual browser QA: homepage, typed cards, release rail, and review summary/pros/cons were inspected at mobile, 768px tablet, and 1440px desktop sizes.

GN-P0-001 through GN-P0-004 were verified on **2026-10-06** from branch `codex/gn-p0-001-004`.

- `pnpm exec tsc --noEmit --incremental false`: **passed**.
- `pnpm lint`: **passed with 0 errors and 41 warnings**. The warnings remain visible and are tracked by GN-P2-007.
- `pnpm build`: **passed** against representative published database content on Next.js 16.3.8, React 19.3.0, and Payload 3.90.2.
- `pnpm test:int`: **passed, 4/4 tests**, covering users plus published articles, reviews, and games.
- `pnpm test:e2e`: **passed, 8/8 tests**, covering Articles, Reviews, Games, and Search on desktop Chromium and a Pixel 7 viewport, including horizontal-overflow checks.
- Production dependency audit: reduced from **117 findings (4 critical)** to **28 findings (0 critical, 1 high)**. The remaining high advisory is the unpatched `braces` dependency in Payload's Sass/Chokidar toolchain and is tracked by GN-P2-011.
- Docker: a clean pnpm/Node 22 standalone image built successfully; an ephemeral container returned **HTTP 200** for `/games` and was removed after the check.

GN-P1-006 and GN-P1-012 were verified on **2026-10-08**.

- `pnpm exec tsc --noEmit --incremental false`: **passed**.
- Focused game-review and cron-access regression tests: **passed, 8/8 tests**.
- `pnpm run test:int`: **passed, 12/12 tests**.
- `pnpm build`: **passed** on Next.js 16.3.8, including static generation and sitemap postbuild.

The GitHub Actions CI implementation was verified locally on **2026-10-08** from branch
`codex/ci-workflow` against a disposable MongoDB 8 service.

- Workflow YAML and changed-file formatting: **passed**.
- `pnpm typecheck`: **passed**.
- `pnpm lint`: **passed with 0 errors and 34 tracked warnings**.
- `pnpm test:int`: **passed, 12/12 tests**.
- `pnpm build`: **passed**, including the sitemap postbuild.
- Production standalone-server Playwright run: **passed, 8/8 desktop/mobile tests**.

## P0 — Launch Blockers

### GN-P0-001 — Vulnerable Next.js release

- **Status:** Verified
- **Evidence:** `package.json` pins Next.js `15.4.4`. The official React Server Components advisory identifies affected Next.js 15 releases and lists patched releases.
- **Risk:** A production App Router deployment can be exposed to critical server-side vulnerabilities.
- **Done when:** Next.js/React/Payload packages are upgraded as a compatible set to a currently supported patched release, the production build and tests pass, and deployed secrets are rotated if an affected version was publicly exposed.
- **Resolution:** Upgraded the compatible stack to Next.js 16.3.8, React 19.3.0, and Payload 3.90.2; patched direct and transitive dependencies; and passed typecheck, build, integration, and E2E verification. If an affected build was publicly deployed, its secrets must still be rotated operationally before release.

### GN-P0-002 — TypeScript failure in shared Card

- **Status:** Verified
- **Evidence:** `src/components/Card/index.tsx` passes a value narrowed only to `object` into the typed Media `resource` prop.
- **Risk:** Production build cannot be considered healthy; the type cast/fallback work around multiple content shapes is unsafe.
- **Done when:** Card uses an explicit Media-compatible type guard/union and `pnpm exec tsc --noEmit --incremental false` passes.
- **Resolution:** Added an explicit generated `Media` type guard for the shared card resource; the clean TypeScript check and production build pass.

### GN-P0-003 — Production build and runtime acceptance are unverified

- **Status:** Verified
- **Evidence:** TypeScript fails; current E2E tests still assert `Payload Website Template`; integration coverage only checks that users can be queried.
- **Risk:** Core routes may fail despite existing files, and regressions will not be caught.
- **Done when:** production build, route smoke tests, integration tests, and mobile/desktop E2E tests pass against representative published content.
- **Resolution:** Replaced stale template E2E coverage with public gaming-route checks, expanded integration coverage, and passed the production build, 4 integration tests, and 8 desktop/mobile E2E tests against published content.

### GN-P0-004 — Package manager and Docker path conflict

- **Status:** Verified
- **Evidence:** npm, Yarn, and pnpm lockfiles coexist. The Dockerfile selects Yarn first, while project scripts use pnpm. The Dockerfile expects `.next/standalone`, but `next.config.js` does not enable standalone output.
- **Risk:** local, CI, and container installs can resolve different dependency trees; Docker production builds/runs can fail.
- **Done when:** one package manager and lockfile are authoritative, CI/Docker use it, and the chosen deployment path is exercised successfully.
- **Resolution:** Standardized on pnpm 10.28.2, removed npm/Yarn lockfiles, aligned local/Docker installs, enabled Next standalone output, and verified a clean Node 22 image plus an HTTP 200 container smoke test.

## P1 — MVP Correctness, SEO, And Trust

### GN-P1-001 — Detail-page Open Graph URLs resolve incorrectly

- **Status:** Open
- **Evidence:** `src/utilities/generateMeta.ts` only derives a URL when `doc.slug` is an array; normal string slugs receive `/`.
- **Impact:** Shared article, review, game, and page metadata can identify the homepage instead of the current document.
- **Done when:** metadata generation receives collection/route context and emits the absolute detail URL plus a canonical URL for every public document type.

### GN-P1-002 — Template social image and placeholder identity remain

- **Status:** Open
- **Evidence:** default metadata references `/website-template-OG.webp`; site name and Twitter handle remain generic/placeholders.
- **Impact:** Search/social previews undermine brand credibility.
- **Done when:** final brand settings and a branded default OG image are used everywhere, and template assets/references are removed.

### GN-P1-003 — Sitemap coverage is incomplete and advertises removed posts

- **Status:** Open
- **Evidence:** only the pages sitemap route exists; static entries omit Reviews and Games; `next-sitemap.config.cjs` references `posts-sitemap.xml`.
- **Impact:** search engines cannot reliably discover gaming detail content and may request nonexistent template routes.
- **Done when:** published pages, articles, reviews, and games are included with correct absolute URLs/last-modified dates, removed routes disappear, and robots.txt references only real sitemaps.

### GN-P1-004 — Search excludes games and stops at 12 results

- **Status:** Open
- **Evidence:** the Payload search plugin indexes only articles and reviews; the UI description claims games; search disables pagination and limits results to 12.
- **Impact:** the core games database is undiscoverable through global search and valid results are silently hidden.
- **Done when:** games are indexed, result types display useful metadata, URLs are encoded safely, query state survives reload/back navigation, and results paginate.

### GN-P1-005 — Review pros/cons and archive identity are missing

- **Status:** Verified
- **Evidence:** pros/cons are modeled but not rendered. Review archive queries rating, but the shared Card does not display rating, excerpt, game, or platform.
- **Impact:** reviews look like generic articles and fail the documented review acceptance criterion.
- **Done when:** review cards and detail pages visibly present the score, verdict/excerpt, game, pros, cons, and required review context.
- **Resolution:** Added a typed review card and detail-page verdict, test context, pros, cons, and disclosure treatments. Score rendering uses an explicit null/undefined check, so `0` remains visible. Verified in the production build and responsive browser QA.

### GN-P1-006 — Game page related-review query is semantically wrong

- **Status:** Verified
- **Evidence:** `queryRelatedReviews` filters through `game.genres` instead of matching the current game relationship.
- **Impact:** a game page can label reviews of other games as reviews of the current game.
- **Done when:** the query matches `review.game` to the current game ID and tests cover games with zero, one, and multiple reviews.
- **Resolution:** Game pages now query reviews with `game equals currentGame.id`. Regression tests cover zero, one, and multiple matching reviews and exclude a review belonging to a different same-genre game; typecheck, the 12-test integration suite, and the production build pass.

### GN-P1-007 — Archive cards discard useful content-type data

- **Status:** Verified
- **Evidence:** the shared Card renders a generic image/title/description/category layout. Article/review archive selects omit hero images, and game-specific fields are ignored.
- **Impact:** placeholders appear unnecessarily and games/reviews do not communicate why they are useful.
- **Done when:** typed ArticleCard, ReviewCard, and GameCard variants expose the relevant image and metadata while sharing base shadcn styling.
- **Resolution:** Replaced the universal card with typed Article, Review, and Game variants built on the shared shadcn Card primitives. Archive and homepage rendering was verified with representative published content at mobile and desktop sizes.

### GN-P1-008 — Game revalidation and redirect coverage are incomplete

- **Status:** Open
- **Evidence:** Games has no revalidation hooks. Redirects are configured only for pages and articles. Article/review hooks do not revalidate archives/homepage dependents.
- **Impact:** published content, related sections, and changed slugs can remain stale or produce broken links.
- **Done when:** all affected details, archives, home blocks, related pages, and sitemap tags are revalidated, and page/article/review/game slugs support redirects.

### GN-P1-009 — Trust and legal surface is incomplete

- **Status:** Open
- **Evidence:** About and Contact have seed support, but no repository definitions were found for Privacy or Terms; editorial, review, corrections, disclosure, and accessibility policies are absent.
- **Impact:** readers, partners, and search platforms lack basic publication accountability and legal information.
- **Done when:** required pages are published, linked in the footer, and accurately describe real practices.

### GN-P1-010 — Seeded footer/admin content still exposes the template

- **Status:** Open
- **Evidence:** default footer seed links to `/admin`, Payload source code, and Payload; admin onboarding mentions pages, posts, and projects.
- **Impact:** a newly seeded environment looks unfinished and can expose an unnecessary admin link.
- **Done when:** seed workflows create only gaming-product navigation/content and admin onboarding reflects the actual editorial operation.

### GN-P1-011 — Forms lack production abuse controls

- **Status:** Open
- **Evidence:** the public form submits directly to form submissions; no rate limiting, honeypot/CAPTCHA strategy, or abuse handling is visible.
- **Impact:** Contact can attract spam and automated submissions.
- **Done when:** the chosen protection is implemented, privacy disclosure is accurate, and accessible success/error flows are tested.

### GN-P1-012 — Cron authorization should fail closed

- **Status:** Verified
- **Evidence:** the job access check compares the Authorization header to `Bearer ${process.env.CRON_SECRET}` without first requiring a configured secret.
- **Impact:** a missing production secret can create ambiguous authorization behavior.
- **Done when:** unauthenticated job execution is denied whenever `CRON_SECRET` is absent/empty, with configuration validation and a focused test.
- **Resolution:** Job access now validates that `CRON_SECRET` is present and non-empty before comparing the bearer token. Focused tests cover absent, empty, whitespace-only, valid, invalid, and authenticated-user paths; typecheck, the 12-test integration suite, and the production build pass.

## P2 — Accessibility, Mobile, Performance, And Maintainability

### GN-P2-001 — Media alternative text is optional and logo alt text is wrong

- **Status:** Open
- **Evidence:** Media `alt` is not required; Logo uses `alt="Payload Logo"` while rendering the project asset.
- **Done when:** editorial image requirements distinguish informative/decorative images, required alt text is enforced where appropriate, and logo text names the publication.
- **Progress:** The public logo is now a text-based `Gaming News` wordmark with the correct accessible name. Editorial media validation remains open.

### GN-P2-002 — Mobile navigation needs accessible dialog behavior

- **Status:** Open
- **Evidence:** custom overlay has no focus trap, Escape handling, body scroll lock, active route treatment, or close-on-navigation behavior.
- **Done when:** an accessible shadcn Sheet/Dialog implementation passes keyboard and screen-reader QA.

### GN-P2-003 — Responsive overflow risks need visual testing

- **Status:** Open
- **Evidence:** base hero titles use large fixed typography; archive search/filter rows and several heading/button layouts do not consistently wrap at narrow widths.
- **Done when:** representative long content passes visual and interaction QA at mobile, tablet, laptop, and wide desktop widths.

### GN-P2-004 — Reduced motion coverage is incomplete

- **Status:** Fixed
- **Evidence:** only hero animations are disabled under `prefers-reduced-motion`; glow, shimmer, navigation slide, and other transitions remain active.
- **Done when:** nonessential animations respect reduced-motion preferences throughout the public UI.
- **Resolution:** The global reduced-motion rule now shortens nonessential animations and transitions across the public UI. A dedicated assistive-setting browser check is still required before marking this `Verified`.

### GN-P2-005 — Image optimization is inconsistent

- **Status:** Open
- **Evidence:** related-game cards use raw `<img>`; shared image defaults use quality 100 and broad generic `sizes` behavior.
- **Done when:** all editorial images use the shared optimized path with route-specific sizes/quality and measured Core Web Vitals.
- **Progress:** Related games now use the shared Media/Next Image path, typed cards provide route-specific responsive `sizes`, and same-origin Payload media URLs no longer trigger blocked image-optimizer self-fetches. Quality defaults and Core Web Vitals measurement remain open.

### GN-P2-006 — Archive facet queries do not scale

- **Status:** Open
- **Evidence:** archive routes load up to 1,000 records to calculate filter counts on every request.
- **Done when:** facets use aggregation/precomputed counts/caching and remain accurate after publishing changes.

### GN-P2-007 — Debug output and weak types remain

- **Status:** Open
- **Evidence:** production paths contain debug `console.log` statements, broad `any` casts, a suppressed RenderBlocks mismatch, and unused imports/arguments.
- **Done when:** debug output is removed, content unions are properly typed, and lint/type checks pass without a hidden regression baseline.

### GN-P2-008 — Generic visual identity

- **Status:** Verified
- **Evidence:** repeated cyan/purple gradients, glow effects, generic copy, and one universal card pattern resemble a gaming template more than a publication system.
- **Done when:** a documented design direction covers typography, color, spacing, content-type cards, data presentation, motion, and responsive behavior using shared shadcn-based components.
- **Resolution:** Introduced an ink/frost/cyan/amber editorial system, a compact display/mono hierarchy, typed shadcn cards, a release-rail data treatment, restrained motion, and responsive homepage layouts. The implementation was manually reviewed at mobile, tablet, and desktop sizes.

### GN-P2-009 — Editorial data completeness is not enforced

- **Status:** Open
- **Evidence:** authors can lack names; publication dates, hero/cover images, media alt text, excerpts, game release data, and several SEO fields are optional.
- **Done when:** publish-time validation enforces the minimum fields required for each public content type without making draft creation painful.

### GN-P2-010 — Pagination is client-button-only

- **Status:** Open
- **Evidence:** archive page numbers render as buttons without crawlable `href` values.
- **Done when:** pagination has real URLs, preserves filters, supports keyboard use, and works without relying solely on client JavaScript.

### GN-P2-011 — One unpatched transitive dependency advisory remains

- **Status:** Open
- **Evidence:** `pnpm audit --prod` reports one high-severity `braces` stack-exhaustion advisory through `@payloadcms/next > sass > chokidar`; the registry currently reports no patched release. All critical advisories and other high advisories found during GN-P0-001 were removed.
- **Impact:** This is a build/tooling dependency path rather than the previously exposed Next.js runtime, but it should remain visible and be retested with Payload/Sass/Chokidar updates.
- **Done when:** an upstream compatible release removes the advisory, the override is unnecessary, and build/tests continue to pass.

### GN-P2-012 — Pull requests lack an automated quality gate

- **Status:** Fixed
- **Found:** 2026-10-08
- **Evidence:** The repository had no GitHub Actions workflow, so pull requests could be merged without an automated lint, type, test, or production-build result.
- **Impact:** Regressions in Payload integration, Next.js production output, or public desktop/mobile routes could reach `master` despite passing an incomplete local check.
- **Done when:** pull requests and pushes to `master` run frozen pnpm installation, lint, type-checking, integration tests against disposable MongoDB, production build, and production-server Playwright tests; failed browser runs retain a diagnostic report; and the hosted workflow passes.
- **Resolution:** Added a least-privilege, concurrency-cancelled GitHub Actions workflow with pnpm and Next.js caches, a MongoDB 8 service, all existing quality gates, the Next.js standalone runtime path, a stable clean-database readiness probe, and failure-only Playwright artifacts. Local parity verification passes. An initial hosted run exposed an obsolete pnpm action bootstrap; the workflow now pins the signed v6 action commit, and the replacement hosted run is pending.

## P3 — Differentiation Backlog

### GN-P3-001 — PlayFit discovery layer

- **Status:** Proposed
- **Summary:** Turn game length and narrative tags into a reader-focused fit profile, then expand carefully into session length, complexity, accessibility, localization, and regional availability.
- **Roadmap:** `02-growth.md`.

### GN-P3-002 — Release Ledger

- **Status:** Proposed
- **Summary:** Build a sourced, dated timeline of announcements, delays, releases, patches, DLC, monetization changes, and server closures on game pages.
- **Roadmap:** `02-growth.md`.

### GN-P3-003 — Versioned reviews

- **Status:** Proposed
- **Summary:** Preserve launch verdicts while adding post-patch and long-term assessments with platform, hours, version, and disclosure context.
- **Roadmap:** `02-growth.md`.

## Roadmap Comparison Summary

The previous roadmap understated completed code and missed several launch risks.

### Implemented since the previous roadmap snapshot

- `posts` is no longer configured or publicly routed.
- `/games` and `/games/[slug]` exist.
- Article/review/game preview routes are mapped correctly.
- Search indexes articles and reviews and carries the originating collection for routing.
- Article, review, and game archive metadata exists.
- Game filtering exists for platform, genre, and narrative tags.
- Latest Articles and Category/Genre Browse homepage blocks exist.
- Archive pagination, basic empty states, and filter persistence exist.

### Previously marked as missing but still genuinely incomplete

- Games are not part of global search.
- Gaming detail sitemaps do not exist.
- Game revalidation is missing.
- Privacy and Terms are not represented in repository content/seed files.
- Template cleanup is incomplete.

### Newly identified work

- Security upgrade and dependency alignment.
- TypeScript/build recovery.
- Correct Open Graph/canonical route metadata.
- Review rendering and game-review relationship correctness.
- Content-type-specific cards.
- Docker/lockfile consistency.
- Accessibility, mobile navigation, spam protection, structured data, RSS, and stronger tests.
- PlayFit, Release Ledger, and versioned reviews as differentiation candidates.

## New Issue Template

Copy this section when adding a future issue:

```md
### GN-P?-NNN — Short issue title

- **Status:** Open
- **Found:** YYYY-MM-DD
- **Evidence:** File, route, failing command, screenshot, or reproducible behavior.
- **Impact:** What is wrong for readers, editors, search engines, security, or operations.
- **Done when:** Objective verification criteria.
```
