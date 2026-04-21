import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'chat_room_members'

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
        .integer('chat_room_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('chat_rooms')
        .onDelete('CASCADE')
      table.timestamp('joined_at').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['user_id', 'chat_room_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
