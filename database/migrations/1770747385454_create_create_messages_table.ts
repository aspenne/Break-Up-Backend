import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('chat_room_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('chat_rooms')
        .onDelete('CASCADE')
      table
        .integer('sender_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table.string('sender_name', 100).notNullable()
      table.text('content').notNullable()
      table.boolean('is_system').notNullable().defaultTo(false)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
