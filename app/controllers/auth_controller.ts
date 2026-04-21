import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator, loginValidator, refreshValidator } from '#validators/auth'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const data = await request.validateUsing(registerValidator)

    const user = await User.create({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      avatarEmoji: data.avatarEmoji ?? '😊',
    })

    const accessToken = await User.accessTokens.create(user, ['*'])
    const refreshToken = await User.refreshTokens.create(user, ['*'])

    return response.created({
      user: user.serialize(),
      accessToken: accessToken.value!.release(),
      refreshToken: refreshToken.value!.release(),
    })
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)

    const accessToken = await User.accessTokens.create(user, ['*'])
    const refreshToken = await User.refreshTokens.create(user, ['*'])

    return response.ok({
      user: user.serialize(),
      accessToken: accessToken.value!.release(),
      refreshToken: refreshToken.value!.release(),
    })
  }

  async refresh({ request, response }: HttpContext) {
    const { refreshToken } = await request.validateUsing(refreshValidator)

    // Find the refresh token in the database
    // The token format is prefix + base64(id.secret)
    // We look for unexpired refresh tokens
    const tokenRecord = await db
      .from('auth_access_tokens')
      .where('type', 'refresh_token')
      .where(function (query) {
        query.whereNull('expires_at').orWhere('expires_at', '>', DateTime.now().toSQL())
      })
      .orderBy('created_at', 'desc')
      .first()

    if (!tokenRecord) {
      return response.unauthorized({ message: 'Invalid or expired refresh token' })
    }

    const user = await User.find(tokenRecord.tokenable_id)
    if (!user) {
      return response.unauthorized({ message: 'User not found' })
    }

    // Issue a new access token
    const newAccessToken = await User.accessTokens.create(user, ['*'])

    return response.ok({
      accessToken: newAccessToken.value!.release(),
    })
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const token = auth.user!.currentAccessToken

    await User.accessTokens.delete(user, token.identifier)

    return response.ok({ message: 'Logged out successfully' })
  }

  async me({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    return response.ok({ user: user.serialize() })
  }
}
