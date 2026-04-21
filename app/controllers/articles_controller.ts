import type { HttpContext } from '@adonisjs/core/http'
import Article from '#models/article'
import ArticleFavorite from '#models/article_favorite'
import { listArticlesValidator } from '#validators/article'

export default class ArticlesController {
  async index({ request, response }: HttpContext) {
    const filters = await request.validateUsing(listArticlesValidator)
    const page = filters.page ?? 1
    const limit = filters.limit ?? 20

    const query = Article.query().orderBy('publishedAt', 'desc')

    if (filters.category) {
      query.where('category', filters.category)
    }

    const articles = await query.paginate(page, limit)

    return response.ok(articles)
  }

  async show({ params, response }: HttpContext) {
    const article = await Article.findOrFail(params.id)
    return response.ok(article)
  }

  async toggleFavorite({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const article = await Article.findOrFail(params.id)

    const existing = await ArticleFavorite.query()
      .where('userId', user.id)
      .where('articleId', article.id)
      .first()

    if (existing) {
      await existing.delete()
      return response.ok({ isFavorite: false })
    }

    await ArticleFavorite.create({
      userId: user.id,
      articleId: article.id,
    })

    return response.ok({ isFavorite: true })
  }

  async favorites({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const articles = await Article.query()
      .whereHas('favoritedBy', (query) => {
        query.where('users.id', user.id)
      })
      .orderBy('publishedAt', 'desc')
      .paginate(page, limit)

    return response.ok(articles)
  }
}
