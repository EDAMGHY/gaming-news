import PageTemplate, { generateMetadata } from './[slug]/page'

// Render the homepage per request so image builds never need the database.
export const dynamic = 'force-dynamic'

export default PageTemplate

export { generateMetadata }
