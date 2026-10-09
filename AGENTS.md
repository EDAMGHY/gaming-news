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

## Required Git Workflow

- Never make project changes, create commits, or push commits directly on `master`.
- Before changing files for any task, create a task-specific branch from `master`, or switch to the existing task branch when continuing an open pull request.
- Name branches `<type>/<short-description>` in kebab-case, where `<type>` describes the change (`feature/`, `fix/`, `deploy/`, `docs/`, `refactor/`, `chore/`), for example `feature/game-search-filters` or `fix/review-score-rounding`. Do not use tool or agent names such as `codex/` or `claude/` as the prefix.
- Keep unrelated user changes intact and out of the task commit.
- Treat implementation and Git publication as separate phases. A request to build, fix, or change the project authorizes local file changes and verification only; it does not authorize a commit, push, or pull request.
- After implementation and verification, stop with the changes uncommitted and provide the user with the changed-file list, a concise diff summary, and all verification results so they can review the work.
- Never commit changes, push a branch, create a pull request, or update an existing pull request until the user explicitly confirms that they have reviewed the current changes and authorizes those Git actions.
- Approval to commit, push, or create a pull request applies only to the reviewed state. If material changes are made afterward, present the updated diff and obtain approval again before publishing them.
- After explicit user approval, commit the completed task to its task branch with a clear, scoped commit message, push it, and create or update the pull request targeting `master` as authorized.
- Report the branch name, commit, pull request URL, and verification results to the user.
- Do not merge the pull request unless the user explicitly asks for it.

## Documentation Files

- `docs/roadmap/00-overview.md`: phase summary and product direction
- `docs/roadmap/01-mvp.md`: detailed MVP checklist
- `docs/roadmap/02-growth.md`: post-MVP feature ideas
- `docs/roadmap/03-monetization.md`: monetization roadmap

- PLEASE SHADCN COMPONENTS FOR UI
- ALWAYS THE CURRENT STATE OF THIS PROJECT WHEN EVER THE STATE CHANGES
- ALWAYS MAKES THE UI BEAUTIFUL AND GOOD WITH MOBILE, TABLET VERSION IN MIND

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
