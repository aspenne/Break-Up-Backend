import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Article extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare excerpt: string

  @column()
  declare content: string

  @column()
  declare category: 'toxic-relationships' | 'grief' | 'trust' | 'rebuilding' | 'self-care'

  @column()
  declare readTimeMinutes: number

  @column()
  declare imageUrl: string | null

  @column.dateTime()
  declare publishedAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @manyToMany(() => User, {
    pivotTable: 'article_favorites',
    pivotTimestamps: { createdAt: 'created_at', updatedAt: false },
  })
  declare favoritedBy: ManyToMany<typeof User>
}
