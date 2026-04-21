import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, computed } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import JournalEntry from '#models/journal_entry'

export default class JournalPrompt extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare question: string

  @column()
  declare category: string

  @column()
  declare dayRangeMin: number

  @column()
  declare dayRangeMax: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => JournalEntry, { foreignKey: 'promptId' })
  declare entries: HasMany<typeof JournalEntry>

  @computed()
  get dayRange(): [number, number] {
    return [this.dayRangeMin, this.dayRangeMax]
  }
}
