import { test } from '@japa/runner'
import { createAuthenticatedUser } from '#tests/helpers'
import Memory from '#models/memory'
import { DateTime } from 'luxon'

test.group('Memories', () => {
  test('creates a memory', async ({ client }) => {
    const { token } = await createAuthenticatedUser()

    const response = await client
      .post('/api/memories')
      .header('Authorization', `Bearer ${token}`)
      .json({ uri: 'photo://test/image.jpg', stage: 'identified' })

    response.assertStatus(201)
    response.assertBodyContains({ uri: 'photo://test/image.jpg', stage: 'identified' })
  })

  test('lists memories excluding deleted', async ({ client, assert }) => {
    const { user, token } = await createAuthenticatedUser()

    await Memory.createMany([
      { userId: user.id, uri: 'a.jpg', stage: 'identified', addedAt: DateTime.now() },
      { userId: user.id, uri: 'b.jpg', stage: 'deleted', addedAt: DateTime.now() },
      { userId: user.id, uri: 'c.jpg', stage: 'hidden', addedAt: DateTime.now() },
    ])

    const response = await client
      .get('/api/memories')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.equal(response.body().data.length, 2)
  })

  test('updates memory stage', async ({ client }) => {
    const { user, token } = await createAuthenticatedUser()

    const memory = await Memory.create({
      userId: user.id,
      uri: 'update.jpg',
      stage: 'identified',
      addedAt: DateTime.now(),
    })

    const response = await client
      .patch(`/api/memories/${memory.id}`)
      .header('Authorization', `Bearer ${token}`)
      .json({ stage: 'hidden' })

    response.assertStatus(200)
    response.assertBodyContains({ stage: 'hidden' })
  })

  test('cannot update another user memory', async ({ client }) => {
    const { user } = await createAuthenticatedUser()
    const { token: otherToken } = await createAuthenticatedUser()

    const memory = await Memory.create({
      userId: user.id,
      uri: 'private.jpg',
      stage: 'identified',
      addedAt: DateTime.now(),
    })

    const response = await client
      .patch(`/api/memories/${memory.id}`)
      .header('Authorization', `Bearer ${otherToken}`)
      .json({ stage: 'archived' })

    response.assertStatus(404)
  })

  test('deletes a memory permanently', async ({ client }) => {
    const { user, token } = await createAuthenticatedUser()

    const memory = await Memory.create({
      userId: user.id,
      uri: 'todelete.jpg',
      stage: 'archived',
      addedAt: DateTime.now(),
    })

    const response = await client
      .delete(`/api/memories/${memory.id}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Memory permanently deleted' })
  })

  test('supports pagination', async ({ client, assert }) => {
    const { user, token } = await createAuthenticatedUser()

    for (let i = 0; i < 5; i++) {
      await Memory.create({
        userId: user.id,
        uri: `pag${i}.jpg`,
        stage: 'identified',
        addedAt: DateTime.now(),
      })
    }

    const response = await client
      .get('/api/memories?page=1&limit=2')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.equal(response.body().data.length, 2)
    assert.equal(response.body().meta.total, 5)
  })

  test('fails with invalid stage', async ({ client }) => {
    const { user, token } = await createAuthenticatedUser()

    const memory = await Memory.create({
      userId: user.id,
      uri: 'badstage.jpg',
      stage: 'identified',
      addedAt: DateTime.now(),
    })

    const response = await client
      .patch(`/api/memories/${memory.id}`)
      .header('Authorization', `Bearer ${token}`)
      .json({ stage: 'invalid_stage' })

    response.assertStatus(422)
  })

  test('returns 401 without auth', async ({ client }) => {
    const response = await client.get('/api/memories')
    response.assertStatus(401)
  })

  test('returns 404 for non-existent memory', async ({ client }) => {
    const { token } = await createAuthenticatedUser()

    const response = await client
      .patch('/api/memories/99999')
      .header('Authorization', `Bearer ${token}`)
      .json({ stage: 'hidden' })

    response.assertStatus(404)
  })
})
