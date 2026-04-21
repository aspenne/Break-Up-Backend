import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('first_name', 50).notNullable().defaultTo('')
      table.string('last_name', 50).notNullable().defaultTo('')
      table.dropColumn('display_name')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('display_name', 100).notNullable().defaultTo('')
      table.dropColumn('first_name')
      table.dropColumn('last_name')
    })
  }
}
