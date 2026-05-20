import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import logger from '@adonisjs/core/services/logger'

/**
 * Champs à masquer dans les logs de requête/réponse pour éviter de fuiter
 * des secrets dans les logs PM2.
 */
const REDACTED_FIELDS = ['password', 'currentPassword', 'newPassword', 'token', 'accessToken', 'refreshToken']

function redact(obj: unknown): unknown {
  if (!obj || typeof obj !== 'object') return obj
  const clone: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    clone[k] = REDACTED_FIELDS.includes(k) ? '[REDACTED]' : v
  }
  return clone
}

export default class LoggerMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
    const start = Date.now()

    await next()

    const duration = Date.now() - start
    const status = response.getStatus()
    const method = request.method()
    const url = request.url(true)

    const base = { method, url, status, duration: `${duration}ms` }

    if (status >= 400) {
      // Sur erreur, on log le body envoyé et le body renvoyé pour pouvoir
      // diagnostiquer un 422 / 400 / 500 sans rejouer la requête.
      const requestBody = redact(request.body())
      const responseBody = response.getBody()

      logger.warn(
        { ...base, requestBody, responseBody },
        `${method} ${url} → ${status}`
      )
      return
    }

    logger.info(base, `${method} ${url} → ${status}`)
  }
}
