import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import logger from '@adonisjs/core/services/logger'

export default class LoggerMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
    const start = Date.now()

    await next()

    const duration = Date.now() - start
    const status = response.getStatus()
    const method = request.method()
    const url = request.url(true)

    const log = status >= 400 ? logger.warn.bind(logger) : logger.info.bind(logger)
    log({ method, url, status, duration: `${duration}ms` }, `${method} ${url} → ${status}`)
  }
}
