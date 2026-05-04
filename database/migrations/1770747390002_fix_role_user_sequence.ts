import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.defer(async (db) => {
      await db.rawQuery(
        `SELECT setval(
           pg_get_serial_sequence('role_user', 'id'),
           COALESCE((SELECT MAX(id) FROM role_user), 0) + 1,
           false
         )`
      )
    })
  }

  async down() {}
}
