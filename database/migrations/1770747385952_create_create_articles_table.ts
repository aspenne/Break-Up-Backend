import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'articles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('title', 300).notNullable()
      table.string('excerpt', 500).notNullable()
      table.text('content').notNullable()
      table
        .enum('category', ['toxic-relationships', 'grief', 'trust', 'rebuilding', 'self-care'])
        .notNullable()
      table.integer('read_time_minutes').unsigned().notNullable().defaultTo(5)
      table.string('image_url', 500).nullable()
      table.timestamp('published_at').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
