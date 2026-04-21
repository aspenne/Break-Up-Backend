import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'journal_prompts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.text('question').notNullable()
      table.string('category', 100).notNullable()
      table.integer('day_range_min').unsigned().notNullable().defaultTo(0)
      table.integer('day_range_max').unsigned().notNullable().defaultTo(365)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
