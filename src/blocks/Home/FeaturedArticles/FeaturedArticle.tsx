import { Article } from '@/payload-types'
import { ArticleCard } from '@/components/ContentCard'

export const FeaturedArticle = (article: Article) => <ArticleCard article={article} />
