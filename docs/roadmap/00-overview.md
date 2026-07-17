# Gaming News Roadmap Overview

## Product Goal

Create a fully functional minimal gaming news website powered by Payload CMS and Next.js.

The site should feel like a real gaming publication, not a generic blog template. The core experience should help visitors quickly find gaming news, reviews, upcoming releases, and game information.

## Phase Order

1. MVP: make the site complete and coherent for public launch.
2. Growth: improve discovery, editorial depth, and user engagement.
3. Monetization: add revenue features after the site has a stable content foundation.

## Phase Files

- `01-mvp.md`: launch-ready minimum product checklist
- `02-growth.md`: features to add after MVP
- `03-monetization.md`: monetization ideas and implementation notes

## Current Strengths

- Payload CMS is already configured.
- Gaming-specific collections already exist for articles, reviews, games, genres, narrative tags, and game lengths.
- Article and review frontend routes already exist.
- Homepage builder includes gaming blocks like featured articles, featured reviews, top reviews, and upcoming games.
- Drafts, scheduled publishing, SEO plugin, redirects plugin, and search plugin are already present.

## Main Current Gaps

- Games exist in CMS but do not have public `/games` and `/games/[slug]` pages yet.
- Search still indexes only old `posts` content.
- Sitemaps still focus on `pages` and `posts`, not gaming-specific content.
- SEO URL generation still uses generic template paths.
- Preview path generation needs to support articles, reviews, and games correctly.
- Public branding and metadata still reference the Payload website template.
- Basic static pages like About, Contact, Privacy, and Terms still need to be created.

## Recommended Product Decision

Use `articles` as the main news/editorial collection for MVP.

Keep `reviews` separate because reviews need ratings, pros/cons, and game relationships.

Keep `games` separate because game pages can become a strong SEO and monetization foundation later.

Decide later whether to remove, hide, or repurpose `posts`.
