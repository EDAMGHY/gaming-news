import 'dotenv/config'
import payload from 'payload'

/**
 * Seeds the "About" navigation link into the Header and Footer globals so the
 * /about page is discoverable from the site chrome.
 *
 * Idempotent: running it multiple times will not create duplicate links.
 *
 * Usage: pnpm seed:about
 */

const ABOUT_LABEL = 'About'
const ABOUT_URL = '/about'

type NavItem = {
  link: {
    type: 'custom'
    url: string
    label: string
    newTab?: boolean | null
  }
}

const aboutNavItem: NavItem = {
  link: {
    type: 'custom',
    url: ABOUT_URL,
    label: ABOUT_LABEL,
    newTab: false,
  },
}

function hasAboutLink(navItems: Array<{ link?: { url?: string | null } }>): boolean {
  return navItems.some((item) => item?.link?.url === ABOUT_URL)
}

async function seedGlobalNav(slug: 'header' | 'footer', maxRows: number) {
  const global = await payload.findGlobal({ slug, depth: 0 })
  const navItems = Array.isArray(global?.navItems) ? [...global.navItems] : []

  if (hasAboutLink(navItems)) {
    console.log(`ℹ️  "${ABOUT_LABEL}" link already present in ${slug} — skipping.`)
    return
  }

  if (navItems.length >= maxRows) {
    console.warn(
      `⚠️  ${slug} nav is full (${navItems.length}/${maxRows}). Add "${ABOUT_LABEL}" manually in the admin.`,
    )
    return
  }

  navItems.push(aboutNavItem)

  await payload.updateGlobal({
    slug,
    data: { navItems },
  })

  console.log(`✅ Added "${ABOUT_LABEL}" link to ${slug}.`)
}

async function seedAbout() {
  try {
    const config = (await import('../src/payload.config')).default
    await payload.init({
      config,
      onInit: async () => {
        console.log('✅ Payload initialized')
      },
    })

    await seedGlobalNav('header', 6)
    await seedGlobalNav('footer', 6)

    console.log('🎉 About navigation seeding complete!')
    process.exit(0)
  } catch (error) {
    console.error('❌ About seeding failed:', error)
    process.exit(1)
  }
}

seedAbout()
