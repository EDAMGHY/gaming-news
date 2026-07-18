import 'dotenv/config'
import payload from 'payload'

/**
 * Seeds a fully-editable "About" page into the Pages collection using the
 * dedicated About blocks (Hero, Stats, Story, Feature grids, Team) plus a
 * closing Call to Action. Everything is manageable afterwards in the admin.
 *
 * Also adds an "About" link to the Header and Footer nav globals.
 *
 * Idempotent: re-running updates the existing page instead of duplicating it.
 *
 * Usage: pnpm seed:about
 */

const ABOUT_SLUG = 'about'

// --- Lexical rich-text helpers -------------------------------------------------

const textNode = (text: string) => ({
  type: 'text',
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})

const paragraph = (text: string) => ({
  type: 'paragraph',
  children: [textNode(text)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  version: 1,
})

const richText = (paragraphs: string[]) => ({
  root: {
    type: 'root',
    children: paragraphs.map(paragraph),
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

// --- Page layout ---------------------------------------------------------------

const buildLayout = () => [
  {
    blockType: 'about-hero',
    badge: 'About Gaming News',
    headingLead: 'Where players come to',
    headingHighlight: 'stay ahead of the game',
    subheading:
      "We're an independent gaming publication delivering trustworthy news, honest reviews, and a living database of every release worth your time — written by players, for players.",
    buttons: [
      { link: { type: 'custom', url: '/articles', label: 'Read the latest', newTab: false } },
      { link: { type: 'custom', url: '/reviews', label: 'Browse reviews', newTab: false } },
    ],
  },
  {
    blockType: 'about-stats',
    autoCounts: true,
    stats: [
      { value: '0+', label: 'Games tracked' },
      { value: '0+', label: 'Reviews published' },
      { value: '0+', label: 'Articles written' },
      { value: '100%', label: 'Powered by players' },
    ],
  },
  {
    blockType: 'about-story',
    eyebrow: 'Our Mission',
    heading: 'Cut through the noise. Get to what matters.',
    body: richText([
      'Gaming moves fast — trailers, leaks, patches, and launches land every single day. We started Gaming News because keeping up shouldn’t mean drowning in hype or chasing clickbait.',
      'Our team plays the games, reads the patch notes, and talks to the community so you don’t have to. Whether you’re deciding what to buy next or just want the real story behind a launch, we’re here to give it to you straight.',
    ]),
    quote:
      'A great gaming site earns your trust one honest verdict at a time. That’s the only metric we care about.',
    quoteAuthor: 'Alex Rivera',
    quoteRole: 'Editor-in-Chief',
  },
  {
    blockType: 'about-features',
    heading: 'What we cover',
    subheading: 'Four pillars, one goal: everything you need to play smarter.',
    style: 'card',
    items: [
      {
        icon: 'newspaper',
        title: 'News',
        description: 'Breaking announcements, patch notes, and industry shifts as they happen.',
        href: '/articles',
      },
      {
        icon: 'star',
        title: 'Reviews',
        description: 'In-depth, score-backed verdicts after we finish the game — not before.',
        href: '/reviews',
      },
      {
        icon: 'gamepad',
        title: 'Games',
        description: 'A living database of releases, upcoming titles, and everything to play next.',
        href: '/games',
      },
      {
        icon: 'trophy',
        title: 'Guides & Features',
        description: 'Deep dives, retrospectives, and the stories behind the games we love.',
        href: '/articles',
      },
    ],
  },
  {
    blockType: 'about-features',
    heading: 'What we stand for',
    subheading: 'The principles behind every story, score, and headline we publish.',
    style: 'row',
    items: [
      {
        icon: 'shield',
        title: 'Editorial Independence',
        description:
          'Our reviews and coverage are never for sale. Scores reflect real play time, not publisher pressure.',
      },
      {
        icon: 'zap',
        title: 'Fast, But Never Sloppy',
        description:
          'We break news quickly, but every story is checked against primary sources before it goes live.',
      },
      {
        icon: 'users',
        title: 'Built With The Community',
        description:
          'From comment threads to Discord, the players we write for shape what we cover next.',
      },
      {
        icon: 'sparkles',
        title: 'Love For The Craft',
        description:
          'We treat games as an art form — celebrating the studios, artists, and designers behind them.',
      },
    ],
  },
  {
    blockType: 'about-team',
    heading: 'The people behind it',
    subheading: 'A small, obsessive team that plays far more games than is probably healthy.',
    members: [
      {
        name: 'Alex Rivera',
        role: 'Editor-in-Chief',
        bio: 'Fifteen years covering the industry, from indie darlings to AAA blockbusters.',
        accent: 'brand',
      },
      {
        name: 'Mira Chen',
        role: 'Reviews Lead',
        bio: 'Believes a great review is honest, specific, and finishes the credits first.',
        accent: 'fuchsia',
      },
      {
        name: 'Jordan Okafor',
        role: 'News Editor',
        bio: 'Always three tabs deep in dev blogs, patch notes, and leak-hunting threads.',
        accent: 'amber',
      },
      {
        name: 'Sam Delacroix',
        role: 'Features Writer',
        bio: 'Loves the weird, the experimental, and the games nobody else is talking about.',
        accent: 'emerald',
      },
    ],
  },
  {
    blockType: 'cta',
    richText: richText(['Never miss a launch again — explore the games or search everything.']),
    links: [
      {
        link: {
          type: 'custom',
          url: '/games',
          label: 'Explore the games',
          appearance: 'default',
          newTab: false,
        },
      },
      {
        link: {
          type: 'custom',
          url: '/search',
          label: 'Search everything',
          appearance: 'outline',
          newTab: false,
        },
      },
    ],
  },
]

// --- Nav helpers ---------------------------------------------------------------

async function seedGlobalNav(slug: 'header' | 'footer', maxRows: number) {
  const global = await payload.findGlobal({ slug, depth: 0 })
  const navItems = Array.isArray(global?.navItems) ? [...global.navItems] : []

  const exists = navItems.some(
    (item: { link?: { url?: string | null } }) => item?.link?.url === `/${ABOUT_SLUG}`,
  )
  if (exists) {
    console.log(`ℹ️  "About" link already present in ${slug} — skipping.`)
    return
  }
  if (navItems.length >= maxRows) {
    console.warn(`⚠️  ${slug} nav is full (${maxRows}). Add the About link manually in the admin.`)
    return
  }

  navItems.push({
    link: { type: 'custom', url: `/${ABOUT_SLUG}`, label: 'About', newTab: false },
  })
  await payload.updateGlobal({ slug, data: { navItems }, context: { disableRevalidate: true } })
  console.log(`✅ Added "About" link to ${slug}.`)
}

// --- Main ----------------------------------------------------------------------

async function seedAbout() {
  try {
    const config = (await import('../src/payload.config')).default
    await payload.init({
      config,
      onInit: async () => console.log('✅ Payload initialized'),
    })

    const data = {
      title: 'About',
      slug: ABOUT_SLUG,
      _status: 'published' as const,
      hero: { type: 'none' as const },
      layout: buildLayout(),
      meta: {
        title: 'About | Gaming News',
        description:
          'Gaming News is an independent publication delivering trustworthy gaming news, honest reviews, and a living database of every release worth your time.',
      },
    }

    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: ABOUT_SLUG } },
      limit: 1,
      draft: true,
      pagination: false,
    })

    // Skip the Next.js revalidate hook — it only works inside the Next runtime.
    const context = { disableRevalidate: true }

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'pages',
        id: existing.docs[0].id,
        context,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: data as any,
      })
      console.log('✅ Updated existing "About" page.')
    } else {
      await payload.create({
        collection: 'pages',
        context,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: data as any,
      })
      console.log('✅ Created "About" page.')
    }

    await seedGlobalNav('header', 6)
    await seedGlobalNav('footer', 6)

    console.log('🎉 About page seeding complete! Visit /about')
    process.exit(0)
  } catch (error) {
    console.error('❌ About seeding failed:', error)
    process.exit(1)
  }
}

seedAbout()
