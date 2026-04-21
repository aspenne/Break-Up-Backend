import type { HttpContext } from '@adonisjs/core/http'
import JournalEntry from '#models/journal_entry'
import {
  createJournalEntryValidator,
  updateJournalEntryValidator,
} from '#validators/journal'

export default class JournalEntriesController {
  async index({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const entries = await JournalEntry.query()
      .where('userId', user.id)
      .preload('prompt')
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    return response.ok(entries)
  }

  async store({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(createJournalEntryValidator)

    const entry = await JournalEntry.create({
      userId: user.id,
      promptId: data.promptId ?? null,
      title: data.title,
      content: data.content,
      emotion: data.emotion,
    })

    return response.created(entry)
  }

  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(updateJournalEntryValidator)

    const entry = await JournalEntry.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    entry.merge(data)
    await entry.save()

    return response.ok(entry)
  }

  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const entry = await JournalEntry.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    await entry.delete()

    return response.ok({ message: 'Entry deleted' })
  }
}
