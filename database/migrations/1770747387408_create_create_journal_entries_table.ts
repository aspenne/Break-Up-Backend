import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'journal_entries'

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
        .integer('prompt_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('journal_prompts')
        .onDelete('SET NULL')
      table.string('title', 300).notNullable()
      table.text('content').notNullable()
      table
        .enum('emotion', [
          'devastated',
          'sad',
          'confused',
          'neutral',
          'hopeful',
          'growing',
          'thriving',
        ])
        .notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
