import { test } from '@japa/runner'
import { createAuthenticatedUser } from '#tests/helpers'

test.group('Users - Update Profile', () => {
  test('updates firstName', async ({ client }) => {
    const { token } = await createAuthenticatedUser()

    const response = await client
      .patch('/api/users/me')
      .header('Authorization', `Bearer ${token}`)
      .json({ firstName: 'Updated' })

    response.assertStatus(200)
    response.assertBodyContains({ user: { firstName: 'Updated' } })
  })

  test('updates avatarEmoji', async ({ client }) => {
    const { token } = await createAuthenticatedUser()

    const response = await client
      .patch('/api/users/me')
      .header('Authorization', `Bearer ${token}`)
      .json({ avatarEmoji: '🌟' })

    response.assertStatus(200)
    response.assertBodyContains({ user: { avatarEmoji: '🌟' } })
  })

  test('updates breakupDate', async ({ client, assert }) => {
    const { token } = await createAuthenticatedUser()

    const response = await client
      .patch('/api/users/me')
      .header('Authorization', `Bearer ${token}`)
      .json({ breakupDate: '2025-01-15' })

    response.assertStatus(200)
    assert.exists(response.body().user.breakupDate)
  })

  test('fails without auth', async ({ client }) => {
    const response = await client.patch('/api/users/me').json({ firstName: 'Hacker' })
    response.assertStatus(401)
  })
})
