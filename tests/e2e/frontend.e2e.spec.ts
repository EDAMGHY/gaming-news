import { expect, test } from '@playwright/test'

const publicRoutes = [
  { path: '/articles', heading: 'Gaming Articles' },
  { path: '/reviews', heading: 'Game Reviews' },
  { path: '/games', heading: 'Games Catalogue' },
  { path: '/search', heading: 'Search' },
]

test.describe('Public gaming routes', () => {
  for (const route of publicRoutes) {
    test(`${route.path} renders without horizontal overflow`, async ({ page }) => {
      const pageErrors: string[] = []
      page.on('pageerror', (error) => pageErrors.push(error.message))

      const response = await page.goto(route.path)

      expect(response?.status()).toBeLessThan(500)
      await expect(page).toHaveTitle(/Save Point/)
      expect(pageErrors, `Client errors while loading ${route.path}`).toEqual([])
      await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible()

      const overflow = await page.evaluate(() => {
        const viewportWidth = document.documentElement.clientWidth
        const elements = Array.from(document.querySelectorAll<HTMLElement>('body *'))
          .filter((element) => {
            const rect = element.getBoundingClientRect()
            return rect.width > 0 && (rect.left < -1 || rect.right > viewportWidth + 1)
          })
          .slice(0, 10)
          .map((element) => ({
            className: element.className,
            left: Math.round(element.getBoundingClientRect().left),
            right: Math.round(element.getBoundingClientRect().right),
            tag: element.tagName.toLowerCase(),
            text: element.textContent?.trim().slice(0, 80),
          }))

        return {
          documentWidth: document.documentElement.scrollWidth,
          elements,
          viewportWidth,
        }
      })
      expect(overflow.documentWidth, JSON.stringify(overflow, null, 2)).toBe(overflow.viewportWidth)
    })
  }
})
