# Production Deployment

This app runs as one Next.js/Payload container. MongoDB Atlas stores content, RAWG-hosted URLs
provide game covers and screenshots, and a Dokploy persistent volume stores the much smaller set of
editorial uploads. The production image pins Node.js 22.22 and runs as UID/GID `1001`.

## How deploys work

The Dokploy server (about 3.7 GB RAM, roughly half used by Dokploy itself) cannot run `next build`,
which peaks at several GB. Images are therefore built on GitHub's runners and Dokploy only pulls and
runs them:

1. A push to `master` runs the `CI` workflow.
2. When CI passes, `.github/workflows/docker-image.yml` builds the Dockerfile and pushes
   `ghcr.io/edamghy/gaming-news:latest` plus an immutable `sha-<commit>` tag.
3. If the `DOKPLOY_DEPLOY_WEBHOOK` secret is set, the workflow calls it and Dokploy redeploys the
   new image.

The build never connects to MongoDB. Article, review, and page routes render on their first request
and are then cached; the collection revalidate hooks refresh them after edits. The homepage renders
per request. Production and local development can share the same MongoDB Atlas cluster, so no
database import is needed for deploys.

## GitHub setup (once)

In the repository settings:

- **Variables → Actions:** `NEXT_PUBLIC_SERVER_URL=https://news.example.com` (final public origin,
  no trailing slash). It is compiled into the client bundle, so changing it requires a new image.
- **Secrets → Actions (optional):** `DOKPLOY_DEPLOY_WEBHOOK`, the deploy webhook URL from the Dokploy
  application's Deployments tab.

After the first publish, open the package on GitHub (Profile → Packages → `gaming-news`) and set its
visibility to **Public** so Dokploy can pull it without credentials. The image contains only built
application code; no secrets are passed to the build. To keep it private instead, add a GHCR
registry in Dokploy with a GitHub personal access token that has `read:packages`.

A build can also be started manually from Actions → Docker image → Run workflow.

## Dokploy setup (once)

1. In the application's **General → Provider**, choose **Docker** and set the image to
   `ghcr.io/edamghy/gaming-news:latest`.
2. In **Environment**, set the runtime values:

   ```dotenv
   DATABASE_URI=mongodb+srv://...
   PAYLOAD_SECRET=...
   NEXT_PUBLIC_SERVER_URL=https://news.example.com
   CRON_SECRET=...
   PREVIEW_SECRET=...
   ```

3. In **Advanced → Volumes**, keep the persistent volume mounted at `/app/public/media`.
4. In **Domains**, route the domain to container port `3000`.
5. Copy the deploy webhook URL into the `DOKPLOY_DEPLOY_WEBHOOK` GitHub secret.

To roll back, set the image tag to an earlier `sha-<commit>` and redeploy.

`RAWG_API_KEY` is needed only by `seed:games`, `seed:content`, and the game-media migration. Public
requests use the RAWG IDs and image URLs already stored in MongoDB and do not consume API requests.

## Docker and Dokploy volume

`public/media` remains outside Git and the Docker build context. This keeps deploys small and avoids
baking mutable uploads into an application image.

The `/app/public/media` directory must be writable by UID/GID `1001`. A Docker-managed named volume
inherits the directory ownership prepared by the image. For a host bind mount, set the host directory
owner to `1001:1001` before starting the container.

For a local production smoke test:

```bash
docker build \
  --build-arg NEXT_PUBLIC_SERVER_URL=https://news.example.com \
  --tag gaming-news:latest \
  .

docker volume create gaming-news-media

docker run --rm \
  --env-file .env.production \
  --mount source=gaming-news-media,target=/app/public/media \
  --publish 3000:3000 \
  gaming-news:latest
```

Back up the media volume independently of MongoDB Atlas. Both are required to restore editorial
uploads and their records.

## RAWG game-media migration

The migration is deliberately staged. Dry runs never write a report, change MongoDB, or delete a
file.

```bash
# Inspect matches. Start with a small sample if desired.
pnpm media:rawg:migrate -- --limit=10
pnpm media:rawg:migrate

# Populate external URLs, clear successfully replaced game relationships, and write a rollback manifest.
pnpm media:rawg:migrate -- --apply

# Resume an interrupted run using the manifest path printed by the first apply run.
pnpm media:rawg:migrate -- --apply --resume=migration-reports/rawg-media-TIMESTAMP.json
```

Deploy or preview the migrated data and verify covers, galleries, metadata, and related content. If
the result is not acceptable, restore the previous relationships before cleanup:

```bash
pnpm media:rawg:rollback -- --manifest=migration-reports/rawg-media-TIMESTAMP.json
pnpm media:rawg:rollback -- --apply --manifest=migration-reports/rawg-media-TIMESTAMP.json
```

After verification, inspect cleanup and then apply it:

```bash
pnpm media:rawg:cleanup -- --manifest=migration-reports/rawg-media-TIMESTAMP.json
pnpm media:rawg:cleanup -- --apply --manifest=migration-reports/rawg-media-TIMESTAMP.json
```

Cleanup re-scans every current collection and global, retains shared media, creates a compressed
archive beside the manifest, and only then deletes unreferenced media records and their exact legacy
filenames. Referenced local media is reduced to its original and admin thumbnail; unrelated
unreferenced media is not touched. Preserve the manifest and archive until Dokploy has been verified
and backed up.

After cleanup, copy the retained files from local `public/media` into the Dokploy volume. Do not copy
the whole pre-migration directory. The 295 already-missing records and unrelated unreferenced files
are reported but are outside this migration's deletion scope.

## Curated RAWG release sync

The game seed is an idempotent RAWG sync keyed by `rawgId`. It follows the full requested date
window, updates existing games instead of creating duplicates, and stores external cover/screenshot
URLs without downloading artwork. Clean-catalogue filtering is enabled by default and rejects adult
content, demos/playtests, bundles/non-game packages, duplicate titles, incomplete records, unsupported
platforms, and records below the publication's minimum RAWG-interest threshold.

Preview a release window without modifying Payload:

```bash
RAWG_DATE_START=2026-09-01 RAWG_DATE_END=2026-10-31 \
  CLEAN_CATALOGUE=true DRY_RUN=true pnpm seed:games
```

After reviewing the preview, import it as published content:

```bash
RAWG_DATE_START=2026-09-01 RAWG_DATE_END=2026-10-31 \
  CLEAN_CATALOGUE=true AUTO_PUBLISH=true pnpm seed:games
```

The importer uses `RAWG_PAGE_SIZE=40` and follows all pages unless `RAWG_END_PAGE` is explicitly set.
Leave `AUTO_PUBLISH` false for routine discovery jobs so newly found games enter editorial review as
drafts.

`pnpm seed:editorial` idempotently creates or refreshes the initial released-game editorial set,
links it to the configured author/categories and released games, and fills the homepage featured
article/review blocks. It does not create local media; editorial cards, heroes, and social metadata
fall back to the linked games' RAWG covers.

## Full editorial-content reset

`pnpm content:reset` is dry-run-only by default. Apply mode deletes articles, reviews, games, media,
their version/search records, and the active `public/media` directory while retaining pages, users,
navigation, and taxonomies. It also removes dangling relationships from retained documents. Apply
mode refuses to run without newly created database and media backups plus explicit confirmation:

```bash
pnpm content:reset -- --apply \
  --confirm=RESET_PUBLIC_CONTENT \
  --database-backup=content-reset-backups/BEFORE_RESET.mongodb.archive.gz \
  --media-backup=content-reset-backups/BEFORE_RESET.public-media.tar
```

## Media behavior

- A local game cover is an editorial override and takes priority over its RAWG URL.
- Local screenshots appear before validated RAWG screenshots and duplicate URLs are removed.
- Only HTTPS URLs beneath `media.rawg.io/media/` are accepted and optimized by Next.js.
- New local uploads keep the original plus a 300-pixel admin thumbnail.
- RAWG data and images are credited through the sitewide footer link.
- Articles, reviews, pages, and other editorial media continue to use Payload's local media library.

## Launch checks

1. Confirm the Dokploy volume is mounted at `/app/public/media` and writable by UID/GID `1001`.
2. Load the homepage, game archive, a game detail gallery, and related-game cards.
3. Inspect a game page's Open Graph image and confirm it is an absolute RAWG URL where applicable.
4. Upload an editorial image in `/admin`, then restart and replace the container and confirm it remains.
5. Verify the RAWG attribution link appears in the footer.
6. Download and test both the MongoDB backup and media-volume backup before deleting migration archives.
