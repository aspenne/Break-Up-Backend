import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Admin middleware : vérifie que l'utilisateur authentifié possède le rôle `admin`.
 * À utiliser APRÈS le middleware `auth`.
 */
export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.getUserOrFail()

    await user.load('roles')
    const isAdmin = user.roles.some((role) => role.name === 'admin')

    if (!isAdmin) {
      return ctx.response.forbidden({
        message: 'Accès réservé aux administrateurs',
      })
    }

    return next()
  }
}
