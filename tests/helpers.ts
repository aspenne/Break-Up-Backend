import User from '#models/user'

let testUserCounter = 0

export async function createAuthenticatedUser(
  overrides?: Partial<{
    email: string
    password: string
    pseudo: string
    avatarEmoji: string
  }>
) {
  testUserCounter++
  const user = await User.create({
    email: overrides?.email ?? `testuser${testUserCounter}_${Date.now()}@test.com`,
    password: overrides?.password ?? 'password123',
    pseudo: overrides?.pseudo ?? `Test${testUserCounter}_${Date.now()}`,
    avatarEmoji: overrides?.avatarEmoji ?? '😊',
  })

  const accessToken = await User.accessTokens.create(user, ['*'])

  return {
    user,
    token: accessToken.value!.release(),
  }
}
