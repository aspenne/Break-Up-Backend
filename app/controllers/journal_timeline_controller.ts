import type { HttpContext } from '@adonisjs/core/http'
import JournalEntry from '#models/journal_entry'

export default class JournalTimelineController {
  async index({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const entries = await JournalEntry.query()
      .where('userId', user.id)
      .select('createdAt', 'emotion')
      .orderBy('createdAt', 'asc')
      .exec()

    const timeline = entries.map((entry) => ({
      date: entry.createdAt.toISODate(),
      emotion: entry.emotion,
    }))

    return response.ok({ timeline })
  }
}
