import { test } from '@japa/runner'
import { createAuthenticatedUser } from '#tests/helpers'

test.group('Blog - Articles (public)', () => {
  test('lists articles', async ({ client, assert }) => {
    const response = await client.get('/api/blog/articles')

    response.assertStatus(200)
    assert.isAbove(response.body().data.length, 0)
    assert.exists(response.body().meta.total)
    assert.exists(response.body().meta.perPage)
    assert.exists(response.body().meta.currentPage)
  })

  test('filters articles by category', async ({ client, assert }) => {
    const response = await client.get('/api/blog/articles?category=grief')

    response.assertStatus(200)
    for (const article of response.body().data) {
      assert.equal(article.category, 'grief')
    }
  })

  test('gets single article by id', async ({ client, assert }) => {
    const listRes = await client.get('/api/blog/articles')
    const articleId = listRes.body().data[0].id

    const response = await client.get(`/api/blog/articles/${articleId}`)

    response.assertStatus(200)
    assert.equal(response.body().id, articleId)
    assert.exists(response.body().title)
    assert.exists(response.body().content)
  })

  test('returns 404 for non-existent article', async ({ client }) => {
    const response = await client.get('/api/blog/articles/99999')
    response.assertStatus(404)
  })
})

test.group('Blog - Favorites', () => {
  test('toggles favorite on', async ({ client }) => {
    const { token } = await createAuthenticatedUser()
    const listRes = await client.get('/api/blog/articles')
    const articleId = listRes.body().data[0].id

    const response = await client
      .post(`/api/blog/articles/${articleId}/favorite`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    response.assertBodyContains({ isFavorite: true })
  })

  test('toggles favorite off on second call', async ({ client }) => {
    const { token } = await createAuthenticatedUser()
    const listRes = await client.get('/api/blog/articles')
    const articleId = listRes.body().data[0].id

    await client
      .post(`/api/blog/articles/${articleId}/favorite`)
      .header('Authorization', `Bearer ${token}`)

    const response = await client
      .post(`/api/blog/articles/${articleId}/favorite`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    response.assertBodyContains({ isFavorite: false })
  })

  test('lists user favorites', async ({ client, assert }) => {
    const { token } = await createAuthenticatedUser()
    const listRes = await client.get('/api/blog/articles')
    const articleId = listRes.body().data[0].id

    await client
      .post(`/api/blog/articles/${articleId}/favorite`)
      .header('Authorization', `Bearer ${token}`)

    const response = await client
      .get('/api/blog/favorites')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.equal(response.body().data.length, 1)
    assert.equal(response.body().data[0].id, articleId)
  })

  test('favorites endpoint requires auth', async ({ client }) => {
    const response = await client.get('/api/blog/favorites')
    response.assertStatus(401)
  })
})
