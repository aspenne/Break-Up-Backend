import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Memory from '#models/memory'
import JournalEntry from '#models/journal_entry'
import Article from '#models/article'
import ChatRoom from '#models/chat_room'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare avatarEmoji: string

  @column.date()
  declare breakupDate: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Memory)
  declare memories: HasMany<typeof Memory>

  @hasMany(() => JournalEntry)
  declare journalEntries: HasMany<typeof JournalEntry>

  @manyToMany(() => Article, {
    pivotTable: 'article_favorites',
    pivotTimestamps: { createdAt: 'created_at', updatedAt: false },
  })
  declare favoriteArticles: ManyToMany<typeof Article>

  @manyToMany(() => ChatRoom, {
    pivotTable: 'chat_room_members',
    pivotTimestamps: { createdAt: 'created_at', updatedAt: false },
    pivotColumns: ['joined_at'],
  })
  declare chatRooms: ManyToMany<typeof ChatRoom>

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '1 hour',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
  })

  static refreshTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'ref_',
    table: 'auth_access_tokens',
    type: 'refresh_token',
  })
}
