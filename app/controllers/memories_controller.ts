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

  /**
   * Compteurs agrégés pour l'écran Souvenirs.
   * sorted = total de photos traitées (toutes étapes confondues).
   * deleted = effectivement supprimées du device.
   * kept    = identifiées / encore présentes.
   */
  async stats({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const rows = await Memory.query()
      .where('userId', user.id)
      .select('stage')
      .count('* as count')
      .groupBy('stage')

    const byStage: Record<string, number> = {}
    for (const r of rows as unknown as Array<{ stage: string; count: string | number }>) {
      byStage[r.stage] = Number(r.count)
    }

    const deleted = byStage.deleted ?? 0
    const kept = byStage.identified ?? 0
    const hidden = byStage.hidden ?? 0
    const archived = byStage.archived ?? 0
    const sorted = deleted + kept + hidden + archived

    return response.ok({ deleted, kept, hidden, archived, sorted })
  }

  async store({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(createMemoryValidator)

    // Upsert by (user_id, asset_id) so the same photo can't be tracked twice
    let memory = data.assetId
      ? await Memory.query()
          .where('userId', user.id)
          .where('assetId', data.assetId)
          .first()
      : null

    if (memory) {
      memory.merge({
        uri: data.uri,
        thumbnailUri: data.thumbnailUri ?? memory.thumbnailUri,
        dateTaken: data.dateTaken ? DateTime.fromISO(data.dateTaken) : memory.dateTaken,
        stage: data.stage ?? memory.stage,
      })
      await memory.save()
      return response.ok(memory)
    }

    memory = await Memory.create({
      userId: user.id,
      assetId: data.assetId ?? null,
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
