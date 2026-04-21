import type { HttpContext } from '@adonisjs/core/http'
import JournalPrompt from '#models/journal_prompt'

export default class JournalPromptsController {
  async index({ request, response }: HttpContext) {
    const daysSinceBreakup = request.input('daysSinceBreakup')

    const query = JournalPrompt.query().orderBy('dayRangeMin', 'asc')

    if (daysSinceBreakup) {
      query.where('dayRangeMin', '<=', daysSinceBreakup).where('dayRangeMax', '>=', daysSinceBreakup)
    }

    const prompts = await query.exec()

    return response.ok(prompts)
  }
}
