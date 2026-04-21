import { test } from '@japa/runner'
import { createAuthenticatedUser } from '#tests/helpers'

test.group('Journal - Entries', () => {
  test('creates a journal entry', async ({ client }) => {
    const { token } = await createAuthenticatedUser()

    const response = await client
      .post('/api/journal/entries')
      .header('Authorization', `Bearer ${token}`)
      .json({ title: 'My first entry', content: 'Today was tough.', emotion: 'sad' })

    response.assertStatus(201)
    response.assertBodyContains({ title: 'My first entry', emotion: 'sad' })
  })

  test('creates entry with promptId', async ({ client, assert }) => {
    const { token } = await createAuthenticatedUser()

    const promptsRes = await client
      .get('/api/journal/prompts')
      .header('Authorization', `Bearer ${token}`)
    const promptId = promptsRes.body()[0].id

    const response = await client
      .post('/api/journal/entries')
      .header('Authorization', `Bearer ${token}`)
      .json({
        title: 'Prompted',
        content: 'Answering a prompt.',
        emotion: 'hopeful',
        promptId,
      })

    response.assertStatus(201)
    assert.equal(response.body().promptId, promptId)
  })

  test('lists entries with pagination', async ({ client, assert }) => {
    const { token } = await createAuthenticatedUser()

    await client
      .post('/api/journal/entries')
      .header('Authorization', `Bearer ${token}`)
      .json({ title: 'Entry', content: 'Content', emotion: 'neutral' })

    const response = await client
      .get('/api/journal/entries')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.isAbove(response.body().data.length, 0)
    assert.exists(response.body().meta)
  })

  test('updates a journal entry', async ({ client }) => {
    const { token } = await createAuthenticatedUser()

    const createRes = await client
      .post('/api/journal/entries')
      .header('Authorization', `Bearer ${token}`)
      .json({ title: 'Before Update', content: 'Content', emotion: 'confused' })
    const entryId = createRes.body().id

    const response = await client
      .patch(`/api/journal/entries/${entryId}`)
      .header('Authorization', `Bearer ${token}`)
      .json({ title: 'After Update', emotion: 'hopeful' })

    response.assertStatus(200)
    response.assertBodyContains({ title: 'After Update', emotion: 'hopeful' })
  })

  test('deletes a journal entry', async ({ client }) => {
    const { token } = await createAuthenticatedUser()

    const createRes = await client
      .post('/api/journal/entries')
      .header('Authorization', `Bearer ${token}`)
      .json({ title: 'To Delete', content: 'Goodbye', emotion: 'sad' })
    const entryId = createRes.body().id

    const response = await client
      .delete(`/api/journal/entries/${entryId}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Entry deleted' })
  })

  test('cannot access other user entries', async ({ client }) => {
    const { token: ownerToken } = await createAuthenticatedUser()

    const createRes = await client
      .post('/api/journal/entries')
      .header('Authorization', `Bearer ${ownerToken}`)
      .json({ title: 'Private', content: 'Secret', emotion: 'devastated' })

    const { token: otherToken } = await createAuthenticatedUser()
    const response = await client
      .patch(`/api/journal/entries/${createRes.body().id}`)
      .header('Authorization', `Bearer ${otherToken}`)
      .json({ title: 'Hacked' })

    response.assertStatus(404)
  })

  test('fails with invalid emotion enum', async ({ client }) => {
    const { token } = await createAuthenticatedUser()

    const response = await client
      .post('/api/journal/entries')
      .header('Authorization', `Bearer ${token}`)
      .json({ title: 'Bad Emotion', content: 'Content', emotion: 'angry' })

    response.assertStatus(422)
  })

  test('returns 401 without auth', async ({ client }) => {
    const response = await client.get('/api/journal/entries')
    response.assertStatus(401)
  })
})

test.group('Journal - Prompts', () => {
  test('lists all prompts', async ({ client, assert }) => {
    const { token } = await createAuthenticatedUser()

    const response = await client
      .get('/api/journal/prompts')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.isAbove(response.body().length, 0)
  })

  test('filters prompts by daysSinceBreakup', async ({ client, assert }) => {
    const { token } = await createAuthenticatedUser()

    const response = await client
      .get('/api/journal/prompts?daysSinceBreakup=5')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    for (const prompt of response.body()) {
      assert.isAtMost(prompt.dayRangeMin, 5)
      assert.isAtLeast(prompt.dayRangeMax, 5)
    }
  })
})

test.group('Journal - Timeline', () => {
  test('returns chronological emotion timeline', async ({ client, assert }) => {
    const { token } = await createAuthenticatedUser()

    await client
      .post('/api/journal/entries')
      .header('Authorization', `Bearer ${token}`)
      .json({ title: 'A', content: 'C', emotion: 'sad' })

    await client
      .post('/api/journal/entries')
      .header('Authorization', `Bearer ${token}`)
      .json({ title: 'B', content: 'D', emotion: 'hopeful' })

    const response = await client
      .get('/api/journal/timeline')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.isArray(response.body().timeline)
    assert.equal(response.body().timeline.length, 2)
    assert.exists(response.body().timeline[0].date)
    assert.exists(response.body().timeline[0].emotion)
  })
})
