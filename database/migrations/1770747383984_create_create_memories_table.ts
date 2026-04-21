import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'memories'

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
      table.string('uri', 500).notNullable()
      table.string('thumbnail_uri', 500).nullable()
      table.date('date_taken').nullable()
      table
        .enum('stage', ['identified', 'hidden', 'archived', 'deleted'])
        .notNullable()
        .defaultTo('identified')
      table.timestamp('added_at').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
