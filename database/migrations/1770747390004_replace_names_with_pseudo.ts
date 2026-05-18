import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('pseudo', 50).nullable()
    })

    this.defer(async (db) => {
      await db.rawQuery(
        `UPDATE users
         SET pseudo = COALESCE(NULLIF(first_name, ''), 'user' || id)
         WHERE pseudo IS NULL`
      )
      await db.rawQuery(
        `ALTER TABLE users ALTER COLUMN pseudo SET NOT NULL`
      )
      await db.rawQuery(
        `CREATE UNIQUE INDEX IF NOT EXISTS users_pseudo_unique ON users(pseudo)`
      )
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('first_name')
      table.dropColumn('last_name')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('first_name', 50).notNullable().defaultTo('')
      table.string('last_name', 50).notNullable().defaultTo('')
    })

    this.defer(async (db) => {
      await db.rawQuery(`DROP INDEX IF EXISTS users_pseudo_unique`)
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('pseudo')
    })
  }
}
