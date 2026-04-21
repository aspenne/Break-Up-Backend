import { test } from '@japa/runner'
import { createAuthenticatedUser } from '#tests/helpers'

test.group('Chat - Rooms', () => {
  test('creates a room and auto-joins creator', async ({ client, assert }) => {
    const { user, token } = await createAuthenticatedUser()

    const response = await client
      .post('/api/chat/rooms')
      .header('Authorization', `Bearer ${token}`)
      .json({ name: 'Test Room', theme: 'support' })

    response.assertStatus(201)
    assert.equal(response.body().name, 'Test Room')
    assert.equal(response.body().participantCount, 1)
    assert.equal(response.body().createdBy, user.id)
  })

  test('lists rooms', async ({ client, assert }) => {
    const { token } = await createAuthenticatedUser()

    await client
      .post('/api/chat/rooms')
      .header('Authorization', `Bearer ${token}`)
      .json({ name: 'List Room', theme: 'grief' })

    const response = await client
      .get('/api/chat/rooms')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.isAbove(response.body().data.length, 0)
  })

  test('joins a room', async ({ client }) => {
    const { token: creatorToken } = await createAuthenticatedUser()

    const createRes = await client
      .post('/api/chat/rooms')
      .header('Authorization', `Bearer ${creatorToken}`)
      .json({ name: 'Join Room', theme: 'rebuilding' })

    const roomId = createRes.body().id

    const { token: joinerToken } = await createAuthenticatedUser()
    const response = await client
      .post(`/api/chat/rooms/${roomId}/join`)
      .header('Authorization', `Bearer ${joinerToken}`)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Joined room' })
  })

  test('joining twice returns Already a member', async ({ client }) => {
    const { token } = await createAuthenticatedUser()

    const createRes = await client
      .post('/api/chat/rooms')
      .header('Authorization', `Bearer ${token}`)
      .json({ name: 'Dupe Room', theme: 'support' })

    const response = await client
      .post(`/api/chat/rooms/${createRes.body().id}/join`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Already a member' })
  })

  test('leaves a room', async ({ client }) => {
    const { token } = await createAuthenticatedUser()

    const createRes = await client
      .post('/api/chat/rooms')
      .header('Authorization', `Bearer ${token}`)
      .json({ name: 'Leave Room', theme: 'trust' })

    const response = await client
      .post(`/api/chat/rooms/${createRes.body().id}/leave`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Left room' })
  })

  test('leaving when not a member returns 404', async ({ client }) => {
    const { token: creatorToken } = await createAuthenticatedUser()

    const createRes = await client
      .post('/api/chat/rooms')
      .header('Authorization', `Bearer ${creatorToken}`)
      .json({ name: 'No Leave Room', theme: 'grief' })

    const { token: outsiderToken } = await createAuthenticatedUser()
    const response = await client
      .post(`/api/chat/rooms/${createRes.body().id}/leave`)
      .header('Authorization', `Bearer ${outsiderToken}`)

    response.assertStatus(404)
  })

  test('returns 401 without auth for rooms', async ({ client }) => {
    const response = await client.get('/api/chat/rooms')
    response.assertStatus(401)
  })
})

test.group('Chat - Messages', () => {
  test('sends a message as member', async ({ client }) => {
    const { token } = await createAuthenticatedUser()

    const createRes = await client
      .post('/api/chat/rooms')
      .header('Authorization', `Bearer ${token}`)
      .json({ name: 'Msg Room', theme: 'support' })

    const response = await client
      .post(`/api/chat/rooms/${createRes.body().id}/messages`)
      .header('Authorization', `Bearer ${token}`)
      .json({ content: 'Hello world' })

    response.assertStatus(201)
    response.assertBodyContains({ content: 'Hello world', isSystem: false })
  })

  test('gets messages as member', async ({ client, assert }) => {
    const { token } = await createAuthenticatedUser()

    const createRes = await client
      .post('/api/chat/rooms')
      .header('Authorization', `Bearer ${token}`)
      .json({ name: 'Read Msg Room', theme: 'support' })

    const roomId = createRes.body().id

    await client
      .post(`/api/chat/rooms/${roomId}/messages`)
      .header('Authorization', `Bearer ${token}`)
      .json({ content: 'First message' })

    const response = await client
      .get(`/api/chat/rooms/${roomId}/messages`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.isAbove(response.body().data.length, 0)
  })

  test('non-member cannot send message', async ({ client }) => {
    const { token: creatorToken } = await createAuthenticatedUser()

    const createRes = await client
      .post('/api/chat/rooms')
      .header('Authorization', `Bearer ${creatorToken}`)
      .json({ name: 'Forbidden Room', theme: 'support' })

    const { token: outsiderToken } = await createAuthenticatedUser()
    const response = await client
      .post(`/api/chat/rooms/${createRes.body().id}/messages`)
      .header('Authorization', `Bearer ${outsiderToken}`)
      .json({ content: 'Should not work' })

    response.assertStatus(403)
  })

  test('non-member cannot read messages', async ({ client }) => {
    const { token: creatorToken } = await createAuthenticatedUser()

    const createRes = await client
      .post('/api/chat/rooms')
      .header('Authorization', `Bearer ${creatorToken}`)
      .json({ name: 'Forbidden Read Room', theme: 'support' })

    const { token: outsiderToken } = await createAuthenticatedUser()
    const response = await client
      .get(`/api/chat/rooms/${createRes.body().id}/messages`)
      .header('Authorization', `Bearer ${outsiderToken}`)

    response.assertStatus(403)
  })
})
