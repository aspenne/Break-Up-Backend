import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import JournalPrompt from '#models/journal_prompt'

export default class JournalEntry extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare promptId: number | null

  @column()
  declare title: string

  @column()
  declare content: string

  @column()
  declare emotion:
    | 'devastated'
    | 'sad'
    | 'confused'
    | 'neutral'
    | 'hopeful'
    | 'growing'
    | 'thriving'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => JournalPrompt, { foreignKey: 'promptId' })
  declare prompt: BelongsTo<typeof JournalPrompt>
}
