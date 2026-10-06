# Project Agent Guide

## Project Description

Gaming News is a gaming publication built with Next.js and Payload CMS. It combines editorial articles, scored reviews, and a games database so readers can follow industry news, evaluate games, and discover what to play. The intended public product includes article, review, and game archives and detail pages; a curated homepage; global search; SEO and sitemap coverage; and the About, Contact, Privacy, and Terms trust pages.

## Current Project State

- Payload collections already exist for `articles`, `reviews`, `games`, `categories`, `genres`, `gameLengths`, and `narrativeTags`.
- Public archive and detail routes exist for articles, reviews, and games.
- Homepage blocks exist for featured/latest articles, featured/top reviews, upcoming games, and category or genre discovery.
- Search currently covers articles and reviews, but not games, and still needs pagination and query-state improvements.
- The repository is transitioning away from generic Payload template behavior and branding. Some template metadata, seed content, tests, and deployment configuration remain.
- GN-P0-001 through GN-P0-004 have been implemented and locally verified: the supported framework stack builds, the shared Card is type-safe, representative integration/E2E coverage passes, and pnpm plus the standalone Docker path are aligned.
- Remaining MVP work is tracked primarily in the P1 and P2 sections of `docs/roadmap/current-state-and-issues.md`, including search/SEO completeness, review and game correctness, trust content, accessibility, and upstream dependency maintenance.
- `docs/roadmap/01-mvp.md` is the implementation source of truth, while `docs/roadmap/current-state-and-issues.md` is the living issue and verification register.

## Change Approval Rule

Do not make a drastic change without the project owner's explicit approval. Stop, explain the proposed change, its impact, risks, migration or rollback plan, and wait for approval before proceeding.

Drastic changes include, but are not limited to:

- deleting, renaming, or replacing collections, routes, fields, or stored content;
- destructive database operations, migrations with data-loss risk, or production data changes;
- removing `posts` or other legacy systems that have not been explicitly approved for removal;
- large architectural rewrites, framework replacements, or broad visual redesigns;
- changing authentication, authorization, secrets, hosting, DNS, billing, analytics, or production infrastructure;
- force-pushing, rewriting shared Git history, deleting branches, or pushing directly to `master`;
- merging a pull request or deploying to production;
- introducing a paid service or a dependency that materially changes security, licensing, or operating cost.

Small, reversible implementation changes within an approved issue are allowed. When scope or risk is ambiguous, treat the change as drastic and ask first.

## Git And Pull Request Workflow

- Never commit or push implementation work directly to `master`.
- Create a dedicated branch using the `codex/` prefix for each focused task.
- Preserve unrelated user changes in a dirty worktree and do not include them in commits unless the owner explicitly asks.
- Run checks appropriate to the changed surface before committing.
- Update the roadmap and current-state issue register whenever implementation or verification status changes.
- Push the dedicated branch and open a GitHub pull request for review.
- Do not merge the pull request without explicit approval.

## Product And UI Expectations

- Treat the project as a gaming publication, not a generic CMS template.
- Use the existing gaming collections before adding new content models.
- Prefer small, direct changes over broad rewrites.
- Use shadcn/Radix-based components for UI work.
- Make public UI polished and responsive across mobile, tablet, laptop, and wide desktop sizes.
- Keep frontend routes, CMS preview URLs, generated metadata, search, sitemaps, navigation, and revalidation behavior aligned.
