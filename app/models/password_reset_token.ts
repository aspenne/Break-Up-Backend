import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class PasswordResetToken extends BaseModel {
  static table = 'password_reset_tokens'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare hash: string

  @column()
  declare attempts: number

  @column.dateTime()
  declare expiresAt: DateTime

  @column.dateTime()
  declare usedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  get isExpired(): boolean {
    return this.expiresAt < DateTime.now()
  }

  get isUsed(): boolean {
    return this.usedAt !== null
  }

  get isLocked(): boolean {
    return this.attempts >= 5
  }

  get isValid(): boolean {
    return !this.isExpired && !this.isUsed && !this.isLocked
  }
}
