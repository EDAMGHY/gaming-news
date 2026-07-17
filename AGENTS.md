# AGENTS.md

## Project Direction

This project is a Payload CMS and Next.js gaming news website. Treat it as a gaming publication product, not a generic Payload website template.

The target MVP is a minimal but complete gaming news site with:

- Articles/news
- Reviews
- Games database pages
- Homepage sections for featured/latest content
- Search across public gaming content
- SEO, sitemaps, and correct metadata
- Basic trust pages: About, Contact, Privacy, Terms

## Current State

The project already has useful gaming-specific CMS collections:

- `articles`
- `reviews`
- `games`
- `categories`
- `genres`
- `gameLengths`
- `narrativeTags`

The codebase still contains generic Payload template leftovers:

- `posts` collection and `/posts` frontend routes
- Template README language
- Template metadata like `Payload Website Template`
- Search indexing only `posts`
- Sitemaps focused on `pages` and `posts`

When making changes, prefer completing the gaming-specific product path instead of extending the old generic blog path.

## Implementation Priorities

Follow this order unless the user asks otherwise:

1. Finish MVP functionality in `docs/roadmap/01-mvp.md`.
2. Fix template leftovers that affect public UX, SEO, preview, search, or sitemap behavior.
3. Add discovery and content-growth features from `docs/roadmap/02-growth.md`.
4. Add monetization features from `docs/roadmap/03-monetization.md` only after the MVP is stable.

## Content Model Guidance

Use `articles` as the main news/editorial content type unless the user explicitly decides to rename or replace it with `news`.

Use `reviews` for scored game reviews.

Use `games` as the central game database. Reviews should link to games, and game pages should eventually show related reviews and articles.

Avoid adding new collections if an existing collection can cleanly support the feature.

## Frontend Route Guidance

Preferred public routes:

- `/` homepage
- `/articles`
- `/articles/[slug]`
- `/reviews`
- `/reviews/[slug]`
- `/games`
- `/games/[slug]`
- `/search`
- `/about`
- `/contact`
- `/privacy`
- `/terms`

Potential later routes:

- `/platforms/[platform]`
- `/genres/[slug]`
- `/categories/[slug]`
- `/deals`
- `/guides`

## SEO And Discovery Rules

For public content, make sure these are aligned:

- Frontend route exists
- CMS preview URL points to the right route
- SEO generated URL points to the right route
- Sitemap includes the route
- Search can find the content if it should be discoverable
- Navigation or homepage links make the content reachable

## Coding Preferences

- Prefer small, direct changes over broad rewrites.
- Keep Payload collections and frontend routes consistent.
- Do not remove `posts` immediately unless the user approves. First decide whether to delete it, hide it, or repurpose it.
- Preserve existing user changes in a dirty worktree.
- Use the roadmap Markdown files as the source of truth for what remains.

## Documentation Files

- `docs/roadmap/00-overview.md`: phase summary and product direction
- `docs/roadmap/01-mvp.md`: detailed MVP checklist
- `docs/roadmap/02-growth.md`: post-MVP feature ideas
- `docs/roadmap/03-monetization.md`: monetization roadmap

- PLEASE SHADCN COMPONENTS FOR UI
- ALWAYS THE CURRENT STATE OF THIS PROJECT WHEN EVER THE STATE CHANGES
- ALWAYS MAKES THE UI BEAUTIFUL AND GOOD WITH MOBILE, TABLET VERSION IN MIND
