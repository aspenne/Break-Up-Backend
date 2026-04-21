import type { HttpContext } from '@adonisjs/core/http'
import Memory from '#models/memory'
import { createMemoryValidator, updateMemoryValidator } from '#validators/memory'
import { DateTime } from 'luxon'

export default class MemoriesController {
  async index({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const memories = await Memory.query()
      .where('userId', user.id)
      .where('stage', '!=', 'deleted')
      .orderBy('addedAt', 'desc')
      .paginate(page, limit)

    return response.ok(memories)
  }

  async store({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(createMemoryValidator)

    const memory = await Memory.create({
      userId: user.id,
      uri: data.uri,
      thumbnailUri: data.thumbnailUri ?? null,
      dateTaken: data.dateTaken ? DateTime.fromISO(data.dateTaken) : null,
      stage: data.stage ?? 'identified',
      addedAt: DateTime.now(),
    })

    return response.created(memory)
  }

  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(updateMemoryValidator)

    const memory = await Memory.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    memory.stage = data.stage
    await memory.save()

    return response.ok(memory)
  }

  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const memory = await Memory.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    await memory.delete()

    return response.ok({ message: 'Memory permanently deleted' })
  }
}
