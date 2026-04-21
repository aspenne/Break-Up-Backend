import { test } from '@japa/runner'
import { createAuthenticatedUser } from '#tests/helpers'

test.group('Auth - Register', () => {
  test('registers a new user and returns tokens', async ({ client, assert }) => {
    const response = await client.post('/api/auth/register').json({
      email: 'new@test.com',
      password: 'password123',
      firstName: 'New',
      lastName: 'User',
    })

    response.assertStatus(201)
    assert.exists(response.body().user)
    assert.equal(response.body().user.email, 'new@test.com')
    assert.equal(response.body().user.firstName, 'New')
    assert.equal(response.body().user.lastName, 'User')
    assert.exists(response.body().accessToken)
    assert.exists(response.body().refreshToken)
    assert.notExists(response.body().user.password)
  })

  test('fails with invalid email', async ({ client }) => {
    const response = await client.post('/api/auth/register').json({
      email: 'not-an-email',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    })
    response.assertStatus(422)
  })

  test('fails with short password', async ({ client }) => {
    const response = await client.post('/api/auth/register').json({
      email: 'valid@test.com',
      password: 'short',
      firstName: 'Test',
      lastName: 'User',
    })
    response.assertStatus(422)
  })

  test('fails with missing firstName', async ({ client }) => {
    const response = await client.post('/api/auth/register').json({
      email: 'valid2@test.com',
      password: 'password123',
      lastName: 'User',
    })
    response.assertStatus(422)
  })
})

test.group('Auth - Login', () => {
  test('logs in with valid credentials', async ({ client, assert }) => {
    await createAuthenticatedUser({ email: 'login@test.com', password: 'password123' })

    const response = await client.post('/api/auth/login').json({
      email: 'login@test.com',
      password: 'password123',
    })

    response.assertStatus(200)
    assert.exists(response.body().user)
    assert.exists(response.body().accessToken)
    assert.exists(response.body().refreshToken)
  })

  test('fails with wrong password', async ({ client }) => {
    await createAuthenticatedUser({ email: 'wrongpw@test.com', password: 'password123' })

    const response = await client.post('/api/auth/login').json({
      email: 'wrongpw@test.com',
      password: 'wrongpassword',
    })
    response.assertStatus(400)
  })

  test('fails with non-existent email', async ({ client }) => {
    const response = await client.post('/api/auth/login').json({
      email: 'nonexistent@test.com',
      password: 'password123',
    })
    response.assertStatus(400)
  })
})

test.group('Auth - Protected', () => {
  test('GET /api/auth/me returns authenticated user', async ({ client, assert }) => {
    const { user, token } = await createAuthenticatedUser()

    const response = await client
      .get('/api/auth/me')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.equal(response.body().user.id, user.id)
    assert.equal(response.body().user.email, user.email)
  })

  test('GET /api/auth/me fails without token', async ({ client }) => {
    const response = await client.get('/api/auth/me')
    response.assertStatus(401)
  })

  test('POST /api/auth/logout deletes the token', async ({ client }) => {
    const { token } = await createAuthenticatedUser()

    const response = await client
      .post('/api/auth/logout')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Logged out successfully' })

    // Token should no longer work
    const meResponse = await client
      .get('/api/auth/me')
      .header('Authorization', `Bearer ${token}`)
    meResponse.assertStatus(401)
  })
})
