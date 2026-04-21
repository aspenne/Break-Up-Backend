import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'article_favorites'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('article_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('articles')
        .onDelete('CASCADE')

      table.timestamp('created_at').notNullable()

      table.unique(['user_id', 'article_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
