# Phase 2: Growth And Differentiation

Last audited against the codebase: **2026-10-06**

## Goal

After the MVP is secure, stable, and trustworthy, improve discovery and build a product identity that is more useful than a generic gaming-news feed.

## 1. Signature Product: PlayFit

Build a reader-facing decision layer around the existing games database.

- [ ] Define the PlayFit vocabulary and editorial rubric before adding fields.
- [ ] Extend games with ideal session length, difficulty/complexity, energy/fatigue, solo/co-op fit, return-after-a-break score, and spoiler-safe content themes.
- [ ] Reuse `gameLengths` and `narrativeTags` instead of duplicating those concepts.
- [ ] Add accessibility-summary fields based on observable features; do not make unsupported accessibility judgments.
- [ ] Add localization fields such as interface language, subtitles, dubbing, and localization-quality notes.
- [ ] Add regional availability/price fields only if the publication can maintain them accurately.
- [ ] Show a concise “Who is this for?” and “Who should skip it?” module on game/review pages.
- [ ] Build `/find-a-game` with filters such as platform, time available, session length, narrative preferences, and accessibility/localization needs.
- [ ] Add a comparison tool for two or three games after the filtering experience is useful.
- [ ] Measure whether PlayFit drives game-page visits, return visits, and outbound store clicks before expanding it.

## 2. Signature Product: Release Ledger

- [ ] Define sourced timeline event types: announcement, delay, date confirmation, release, major patch, DLC, monetization change, and server closure.
- [ ] Distinguish official statements, credible reports, rumors, corrections, and editorial analysis.
- [ ] Store source URL, source name, publication date, verification date, and editor for every event.
- [ ] Show a spoiler-safe chronological ledger on each relevant game page.
- [ ] Link articles to ledger events so news coverage remains useful after the headline cycle.
- [ ] Add correction history rather than silently replacing material claims.
- [ ] Add notification/subscription support only after the ledger is consistently maintained.

## 3. Versioned Reviews

- [ ] Store platform tested, hours played, completion state, game version, review-copy source, and embargo information.
- [ ] Support launch review, post-patch update, and long-term/state-of-the-game entries.
- [ ] Show score changes with dated explanations instead of silently overwriting the original verdict.
- [ ] Add a consistent live-service review policy.
- [ ] Keep commercial disclosures visually distinct from editorial verdicts.

## 4. Taxonomy And Discovery

- [ ] Add category pages such as `/categories/[slug]`.
- [ ] Add genre pages such as `/genres/[slug]`.
- [ ] Add platform pages such as `/platforms/pc`, `/platforms/ps5`, and `/platforms/switch-2`.
- [ ] Add narrative-tag pages only when enough games use each tag to make the pages valuable.
- [ ] Add a release calendar at `/releases` with platform, date window, genre, and status filters.
- [ ] Add release-window and game-length filters to `/games`. **Partial:** platform, genre, and narrative-tag filters already exist.
- [ ] Add rating, platform, and genre filters to `/reviews`. **Partial:** category filtering already exists.
- [ ] Add useful sorting: newest, release date, highest rated, shortest/longest, and recently updated.
- [ ] Use readable slugs in public taxonomy URLs rather than exposing database IDs.

## 5. Editorial Features And Trust

- [ ] Use categories for Guides, Features, Opinion, Interviews, Previews, and Industry reporting unless a separate content model becomes necessary.
- [ ] Add evergreen lists only when they include a clear methodology and maintenance owner.
- [ ] Add related articles to review pages.
- [ ] Add accurate related reviews/articles to game pages. **Partial:** related reviews now match the explicit game relationship; related articles are still missing.
- [ ] Add author profile pages with biography, role, beats, disclosures, and recent work.
- [ ] Publish editorial, review scoring, corrections, ethics, affiliate, AI-use, and review-copy policies.
- [ ] Add visible sourcing and correction notes to articles.
- [ ] Add “last reviewed/verified” dates to database information that can become stale.

## 6. Homepage Improvements

- [x] Add an automatic Latest News block.
- [x] Add a combined category/genre discovery block.
- [ ] Add Browse by Platform.
- [ ] Add Editor's Picks with explicit editorial selection.
- [ ] Add Most Anticipated Games with a defined selection method.
- [ ] Add a PlayFit entry point (“Find your next game”).
- [ ] Add a compact release-calendar module.
- [ ] Add newsletter signup after a newsletter product and privacy policy exist.

## 7. User Engagement

- [ ] Add newsletter signup and a useful recurring editorial format.
- [ ] Add share controls that do not add heavy tracking scripts.
- [ ] Add reading time to articles.
- [ ] Let readers save filters or games only after there is a clear privacy/account plan.
- [ ] Add comments only after moderation rules, tooling, staffing, and abuse handling are defined.
- [ ] Add reactions only if analytics show they support a specific editorial decision.
- [ ] Consider release alerts and game-following after the Release Ledger is reliable.

## 8. Content Operations

- [ ] Improve admin columns, filters, and saved views for articles, reviews, games, and releases.
- [ ] Add editorial workflow states if Payload drafts are insufficient.
- [ ] Add internal notes, assignment, fact-check, and copy-edit ownership where needed.
- [ ] Add source/citation records for reported news.
- [ ] Add embargo, review-copy, sponsorship, affiliate, and conflict disclosures.
- [ ] Add content freshness reminders for game data, guides, lists, and live-service reviews.
- [ ] Define ownership for database facts imported from third-party APIs.

## 9. Performance And UX

- [ ] Establish mobile/tablet/desktop visual regression coverage for the homepage and primary routes.
- [ ] Audit image sizes, formats, focal points, loading priority, and cumulative layout shift.
- [x] Add basic empty states to archive pages.
- [ ] Add polished loading, error, offline, and no-JavaScript states where appropriate.
- [x] Preserve filters while using archive pagination.
- [ ] Make pagination linkable/crawlable with real `href` values in addition to client navigation.
- [ ] Add performance budgets for JavaScript, images, fonts, and third-party scripts.
- [ ] Track Core Web Vitals by route type.

## 10. Analytics And Product Learning

- [ ] Add privacy-friendly analytics after the privacy policy is published.
- [ ] Track article, review, game, search, PlayFit, and Release Ledger usage.
- [ ] Track zero-result searches to guide taxonomy and content work.
- [ ] Track filter usage and where readers abandon the discovery flow.
- [ ] Measure returning readers and newsletter retention, not only page views.
- [ ] Use collected evidence to decide future categories and features.
