import 'dotenv/config'

/* eslint-disable @typescript-eslint/no-explicit-any -- seed data crosses generated Lexical/Payload boundaries */

import payload from 'payload'

import type { Article, Review } from '../src/payload-types'

type LexicalNode = { text: string; type: 'h2' | 'h3' | 'p' }

const NOW = new Date('2026-10-09T12:00:00.000Z')
const DAY = 24 * 60 * 60 * 1000

const slugify = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 100)

const lexical = (nodes: LexicalNode[]) => ({
  root: {
    children: nodes.map((node) => ({
      children: [
        {
          detail: 0,
          format: 0,
          mode: 'normal',
          style: '',
          text: node.text,
          type: 'text',
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      ...(node.type === 'p'
        ? { textFormat: 0, type: 'paragraph' }
        : { tag: node.type, type: 'heading' }),
      version: 1,
    })),
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
})

const getCategory = async (slug: string, title: string): Promise<string> => {
  const existing = await payload.find({
    collection: 'categories',
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: slug } },
  })
  if (existing.docs[0]) return String(existing.docs[0].id)

  const created = await payload.create({
    collection: 'categories',
    data: { slug, slugLock: true, title },
    overrideAccess: true,
  })
  return String(created.id)
}

const getGame = async (slug: string) => {
  const result = await payload.find({
    collection: 'games',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: slug } },
  })
  if (!result.docs[0]) throw new Error(`Required released game is missing: ${slug}`)
  if (!result.docs[0].releaseDate || new Date(result.docs[0].releaseDate) > NOW) {
    throw new Error(`Game is not released as of ${NOW.toISOString()}: ${slug}`)
  }
  return result.docs[0]
}

const upsertArticle = async (data: Record<string, any>) => {
  const existing = await payload.find({
    collection: 'articles',
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: data.slug } },
  })
  if (existing.docs[0]) {
    return payload.update({
      collection: 'articles',
      context: { disableRevalidate: true },
      data: data as any,
      id: existing.docs[0].id,
      overrideAccess: true,
    })
  }
  return payload.create({
    collection: 'articles',
    context: { disableRevalidate: true },
    data: data as any,
    overrideAccess: true,
  })
}

const upsertReview = async (data: Record<string, any>) => {
  const existing = await payload.find({
    collection: 'reviews',
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: data.slug } },
  })
  if (existing.docs[0]) {
    return payload.update({
      collection: 'reviews',
      context: { disableRevalidate: true },
      data: data as any,
      id: existing.docs[0].id,
      overrideAccess: true,
    })
  }
  return payload.create({
    collection: 'reviews',
    context: { disableRevalidate: true },
    data: data as any,
    overrideAccess: true,
  })
}

const main = async () => {
  const config = (await import('../src/payload.config')).default
  await payload.init({ config })

  const [reviewsCategory, featuresCategory, newsCategory] = await Promise.all([
    getCategory('reviews', 'Reviews'),
    getCategory('features', 'Features'),
    getCategory('news', 'News'),
  ])
  const users = await payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
    overrideAccess: true,
  })
  const authorId = users.docs[0] ? String(users.docs[0].id) : undefined

  const games = {
    aceCombat: await getGame('ace-combat-8-wings-of-theve'),
    bloodOfDawnwalker: await getGame('the-blood-of-dawnwalker'),
    control: await getGame('control-resonant'),
    gears: await getGame('gears-of-war-e-day'),
    onimusha: await getGame('onimusha-way-of-the-sword'),
    silentHill: await getGame('silent-hill-townfall-2'),
    wolverine: await getGame('wolverine-2022'),
  }

  const disclosure =
    'This editorial review was prepared from release materials and a synthesis of published critical coverage. No review copy was received, and no publisher had editorial input. Replace this disclosure when an original staff hands-on review is completed.'

  const reviewDefinitions = [
    {
      body: [
        {
          type: 'p' as const,
          text: 'Gears of War: E-Day succeeds by making the series feel heavy again. Its cover shooting is direct, physical, and built around arenas that reward movement without losing the deliberate rhythm that defined the originals.',
        },
        { type: 'h2' as const, text: 'Combat carries the campaign' },
        {
          type: 'p' as const,
          text: 'The Coalition gives every firefight a clear tactical shape. Weapons hit with convincing force, enemy pressure creates readable choices, and the best encounters allow aggressive players to push forward instead of waiting behind the nearest wall.',
        },
        { type: 'h2' as const, text: 'A human-scale origin story' },
        {
          type: 'p' as const,
          text: 'Returning to Emergence Day gives Marcus and Dom room to exist before they become legends. The slower connective passages do not always sustain the campaign’s momentum, but the friendship at its center gives the spectacle a useful emotional anchor.',
        },
        { type: 'h2' as const, text: 'Verdict' },
        {
          type: 'p' as const,
          text: 'E-Day is a confident mechanical reset: visually imposing, consistently satisfying in combat, and occasionally held back by uneven pacing. It is strongest when the guns are loud and the stakes remain personal.',
        },
      ],
      cons: [
        'Campaign pacing slows between its strongest encounters',
        'The prequel structure limits some narrative surprise',
      ],
      excerpt:
        'A brutal, polished return to the foundations of Gears, powered by excellent combat and uneven momentum.',
      game: games.gears,
      pros: [
        'Weighty, tactical cover shooting',
        'Striking Unreal Engine 5 presentation',
        'A grounded Marcus and Dom origin story',
      ],
      publishedAt: new Date(NOW.getTime() - DAY).toISOString(),
      rating: 4,
      title: 'Gears of War: E-Day Review — A Brutal Return to Form',
    },
    {
      body: [
        {
          type: 'p' as const,
          text: 'Ace Combat 8 understands that arcade flight is as much about rhythm and spectacle as it is about aircraft. Every sortie builds toward a dramatic reversal, a desperate interception, or a final run that turns the sky into a stage.',
        },
        { type: 'h2' as const, text: 'Accessible flight with real weight' },
        {
          type: 'p' as const,
          text: 'The handling remains approachable, but aircraft carry enough momentum to make positioning matter. The result is immediate without feeling disposable: easy to understand, demanding to master, and consistently exhilarating when several threats converge.',
        },
        { type: 'h2' as const, text: 'Melodrama at altitude' },
        {
          type: 'p' as const,
          text: 'The campaign embraces the series’ heightened military drama, supported by confident mission staging and a soundtrack that knows exactly when to take over. Some dialogue is more earnest than elegant, but restraint has never been Ace Combat’s destination.',
        },
        { type: 'h2' as const, text: 'Verdict' },
        {
          type: 'p' as const,
          text: 'Wings of Theve is a focused celebration of arcade aerial combat. Its combination of responsive flying, theatrical missions, and audiovisual confidence makes it one of the release window’s clearest recommendations.',
        },
      ],
      cons: [
        'The story’s military melodrama will not suit everyone',
        'Mission readability can suffer during its busiest moments',
      ],
      excerpt:
        'A thrilling, confident arcade-flight campaign that turns every sortie into a piece of airborne theatre.',
      game: games.aceCombat,
      pros: [
        'Responsive aircraft with convincing momentum',
        'Excellent mission escalation',
        'A soundtrack built for heroic reversals',
      ],
      publishedAt: new Date(NOW.getTime() - 3 * DAY).toISOString(),
      rating: 4.5,
      title: 'Ace Combat 8: Wings of Theve Review — The Sky Is the Stage',
    },
    {
      body: [
        {
          type: 'p' as const,
          text: 'Marvel’s Wolverine gives Logan a sharper and more intimate kind of superhero game. Insomniac’s cinematic instincts remain obvious, but the close-range combat and smaller emotional focus distinguish it from the studio’s Spider-Man work.',
        },
        { type: 'h2' as const, text: 'Fast, physical combat' },
        {
          type: 'p' as const,
          text: 'Fights are built around momentum, quick target changes, and aggressive finishers. The action communicates Logan’s power immediately, even when the surrounding progression systems promise more depth than the campaign ultimately demands.',
        },
        { type: 'h2' as const, text: 'A familiar structure, a different hero' },
        {
          type: 'p' as const,
          text: 'The broader mission structure is polished rather than radical. What gives it identity is Logan himself: a damaged protagonist whose search for answers allows the story to trade constant spectacle for quieter, more character-driven scenes.',
        },
        { type: 'h2' as const, text: 'Verdict' },
        {
          type: 'p' as const,
          text: 'Wolverine is a visually spectacular action game with a strong central performance and gratifying combat. It plays its overall structure safely, but the character work gives the journey enough bite.',
        },
      ],
      cons: [
        'Progression is less deep than it first appears',
        'The mission structure can feel overly familiar',
      ],
      excerpt:
        'Visually spectacular and satisfyingly physical, even when its familiar structure plays things a little safe.',
      game: games.wolverine,
      pros: [
        'Visceral, readable close-range combat',
        'Strong cinematic presentation',
        'A focused and emotional Logan story',
      ],
      publishedAt: new Date(NOW.getTime() - 12 * DAY).toISOString(),
      rating: 4,
      title: 'Marvel’s Wolverine Review — Sharp Claws, Safe Structure',
    },
    {
      body: [
        {
          type: 'p' as const,
          text: 'Onimusha: Way of the Sword revives Capcom’s dark samurai series with confidence. Its version of Edo-era Kyoto is beautiful and hostile, built around deliberate exploration and sword fights where timing matters more than frantic button presses.',
        },
        { type: 'h2' as const, text: 'Swordplay with consequence' },
        {
          type: 'p' as const,
          text: 'The combat asks players to read opponents, commit to attacks, and earn the advantage. Parries and counters feel decisive, while the Oni Gauntlet gives encounters a supernatural edge without erasing the discipline at the center of each duel.',
        },
        { type: 'h2' as const, text: 'Kyoto transformed' },
        {
          type: 'p' as const,
          text: 'Malice twists recognizable streets into a dense dark-fantasy landscape. The visual direction makes even routine exploration memorable, though repeated enemy types occasionally reduce the tension across longer sessions.',
        },
        { type: 'h2' as const, text: 'Verdict' },
        {
          type: 'p' as const,
          text: 'Way of the Sword is a demanding and rewarding revival that understands what made Onimusha distinctive. Its punishing edge will narrow the audience, but patient players will find one of the year’s most satisfying action games.',
        },
      ],
      cons: [
        'A punishing opening can discourage newcomers',
        'Some enemy repetition dulls longer stretches',
      ],
      excerpt:
        'A gorgeous, demanding revival built on disciplined swordplay and a memorable dark-fantasy Kyoto.',
      game: games.onimusha,
      pros: [
        'Precise and rewarding sword combat',
        'Exceptional dark-fantasy art direction',
        'A confident modern Onimusha identity',
      ],
      publishedAt: new Date(NOW.getTime() - 28 * DAY).toISOString(),
      rating: 4.5,
      title: 'Onimusha: Way of the Sword Review — A Worthy Revival',
    },
  ]

  const reviews: Review[] = []
  for (const definition of reviewDefinitions) {
    const slug = slugify(definition.title)
    reviews.push(
      await upsertReview({
        _status: 'published',
        authors: authorId ? [authorId] : [],
        categories: [reviewsCategory],
        content: lexical(definition.body),
        disclosure,
        excerpt: definition.excerpt,
        game: String(definition.game.id),
        meta: { description: definition.excerpt, title: definition.title },
        pros: definition.pros.map((text) => ({ text })),
        cons: definition.cons.map((text) => ({ text })),
        publishedAt: definition.publishedAt,
        rating: definition.rating,
        slug,
        slugLock: true,
        title: definition.title,
      }),
    )
    console.log(`Review ready: ${definition.title}`)
  }

  const articleDefinitions = [
    {
      body: [
        {
          type: 'p' as const,
          text: 'September’s strongest releases did not chase the same genre or audience, but they shared a useful confidence. Onimusha, Marvel’s Wolverine, Control Resonant, Silent Hill: Townfall, and The Blood of Dawnwalker each committed to a distinct style of action instead of sanding away their differences.',
        },
        { type: 'h2' as const, text: 'Combat with a clear identity' },
        {
          type: 'p' as const,
          text: 'Onimusha emphasized patience and timing. Wolverine moved in the opposite direction, making momentum and aggression the point. The Blood of Dawnwalker framed combat through role-playing choices, while Control Resonant used supernatural abilities to make space itself feel unstable.',
        },
        { type: 'h2' as const, text: 'Atmosphere became a mechanic' },
        {
          type: 'p' as const,
          text: 'Silent Hill: Townfall demonstrated the other side of the month. Its tension came from uncertainty and restraint, a reminder that interaction does not need to be fast to feel active. Across these releases, presentation supported the mechanics instead of merely decorating them.',
        },
        { type: 'h2' as const, text: 'A healthy month for distinct games' },
        {
          type: 'p' as const,
          text: 'The lesson from September was not that one combat model had won. It was that strong games communicate what they value early, then build their worlds around that decision. Variety mattered more than scale.',
        },
      ],
      category: featuresCategory,
      description:
        'Five major September releases showed how much stronger action games become when mechanics and atmosphere share a clear identity.',
      featured: true,
      games: [
        games.onimusha,
        games.wolverine,
        games.control,
        games.silentHill,
        games.bloodOfDawnwalker,
      ],
      publishedAt: new Date(NOW.getTime() - 2 * DAY).toISOString(),
      title: 'September 2026’s Standout Games Shared One Big Strength',
    },
    {
      body: [
        {
          type: 'p' as const,
          text: 'Prequels often explain too much. Gears of War: E-Day works best when it does the opposite: it returns Marcus Fenix and Dom Santiago to the moment everything changed, then lets the fear and confusion of Emergence Day restore a sense of vulnerability to the series.',
        },
        { type: 'h2' as const, text: 'Before the iconography' },
        {
          type: 'p' as const,
          text: 'The familiar armor, weapons, and relationships carry different weight before they become legend. E-Day is not simply filling a gap in a timeline; it is showing how ordinary military tools and personal loyalties hardened into the language of the original trilogy.',
        },
        { type: 'h2' as const, text: 'Mechanical history matters too' },
        {
          type: 'p' as const,
          text: 'The return to a more grounded crisis supports the combat. Encounters feel immediate and local, and the best battlefields make the Locust invasion feel like an unfolding disaster rather than another established front in a long war.',
        },
        { type: 'h2' as const, text: 'A prequel with a purpose' },
        {
          type: 'p' as const,
          text: 'E-Day matters because it uses history to renew the present-day identity of Gears. The story may lead toward events players already know, but the emotional and mechanical perspective makes the journey valuable on its own.',
        },
      ],
      category: featuresCategory,
      description:
        'E-Day uses the origins of Marcus, Dom, and the Locust war to make Gears feel vulnerable—and relevant—again.',
      featured: true,
      games: [games.gears],
      publishedAt: new Date(NOW.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      title: 'Why Gears of War: E-Day Makes the Prequel Matter',
    },
    {
      body: [
        {
          type: 'p' as const,
          text: 'Ace Combat 8 arrives in a market crowded with enormous open worlds and persistent progression systems. Its answer is refreshingly direct: put the player in a fast aircraft, construct a dramatic mission, and make the next fifteen minutes impossible to ignore.',
        },
        { type: 'h2' as const, text: 'Arcade does not mean disposable' },
        {
          type: 'p' as const,
          text: 'Wings of Theve is approachable without flattening the experience. Aircraft retain a sense of weight, positioning matters, and missions layer new threats carefully enough that spectacle remains connected to decision-making.',
        },
        { type: 'h2' as const, text: 'The campaign as performance' },
        {
          type: 'p' as const,
          text: 'Radio chatter, music, weather, and shifting objectives turn each sortie into a small dramatic arc. The series’ earnest tone remains intact, and that commitment is part of the appeal rather than an embarrassment to hide.',
        },
        { type: 'h2' as const, text: 'A lane worth protecting' },
        {
          type: 'p' as const,
          text: 'Ace Combat 8 demonstrates why focused arcade games still matter. It does not need to become a simulation or a service platform. It only needs to make the sky feel dangerous, readable, and spectacular—and it does.',
        },
      ],
      category: newsCategory,
      description:
        'Wings of Theve shows that focused arcade flight can still deliver scale, drama, and mechanical depth without becoming a simulation.',
      featured: false,
      games: [games.aceCombat],
      publishedAt: new Date(NOW.getTime() - 4 * DAY).toISOString(),
      title: 'Ace Combat 8 Proves Arcade Flight Still Has Room to Climb',
    },
  ]

  const articles: Article[] = []
  for (const definition of articleDefinitions) {
    const slug = slugify(definition.title)
    articles.push(
      await upsertArticle({
        _status: 'published',
        authors: authorId ? [authorId] : [],
        categories: [definition.category],
        content: lexical(definition.body),
        games: definition.games.map(({ id }) => String(id)),
        isFeatured: definition.featured,
        meta: { description: definition.description, title: definition.title },
        primaryCategory: definition.category,
        publishedAt: definition.publishedAt,
        slug,
        slugLock: true,
        title: definition.title,
      }),
    )
    console.log(`Article ready: ${definition.title}`)
  }

  for (const review of reviews) {
    await payload.update({
      collection: 'reviews',
      context: { disableRevalidate: true },
      data: { relatedReviews: reviews.filter(({ id }) => id !== review.id).map(({ id }) => id) },
      id: review.id,
      overrideAccess: true,
    })
  }
  for (const article of articles) {
    await payload.update({
      collection: 'articles',
      context: { disableRevalidate: true },
      data: { relatedArticles: articles.filter(({ id }) => id !== article.id).map(({ id }) => id) },
      id: article.id,
      overrideAccess: true,
    })
  }

  const home = await payload.find({
    collection: 'pages',
    depth: 0,
    draft: true,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: 'home' } },
  })
  if (home.docs[0]) {
    const layout = (home.docs[0].layout ?? []).map((block: any) => {
      if (block.blockType === 'featured-articles') {
        return { ...block, articles: articles.map(({ id }) => id) }
      }
      if (block.blockType === 'featuredReviews') {
        return { ...block, reviews: reviews.map(({ id }) => id) }
      }
      return block
    })
    await payload.update({
      collection: 'pages',
      context: { disableRevalidate: true },
      data: {
        _status: 'published',
        hero: { ...home.docs[0].hero, media: null, type: 'lowImpact' },
        layout,
      } as any,
      id: home.docs[0].id,
      overrideAccess: true,
    })
    console.log('Homepage featured articles and reviews updated.')
  }

  console.log(`Editorial seed complete: ${reviews.length} reviews, ${articles.length} articles.`)
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
