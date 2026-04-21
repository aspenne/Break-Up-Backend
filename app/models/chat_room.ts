import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Message from '#models/message'
import User from '#models/user'

export default class ChatRoom extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare theme: string

  @column()
  declare participantCount: number

  @column()
  declare isDirectMessage: boolean

  @column()
  declare createdBy: number | null

  @column.dateTime()
  declare lastMessageAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>

  @manyToMany(() => User, {
    pivotTable: 'chat_room_members',
    pivotTimestamps: { createdAt: 'created_at', updatedAt: false },
    pivotColumns: ['joined_at'],
  })
  declare members: ManyToMany<typeof User>
}
