import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'journal_entries'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('custom_emotion', 80).nullable()
    })

    this.defer(async (db) => {
      await db.rawQuery(
        `ALTER TABLE journal_entries
         DROP CONSTRAINT IF EXISTS journal_entries_emotion_check`
      )
      await db.rawQuery(
        `ALTER TABLE journal_entries
         ADD CONSTRAINT journal_entries_emotion_check
         CHECK (emotion IN ('devastated','sad','confused','neutral','hopeful','growing','thriving','other'))`
      )
    })
  }

  async down() {
    this.defer(async (db) => {
      // Clear any rows that would violate the restored constraint
      await db.rawQuery(
        `DELETE FROM journal_entries WHERE emotion = 'other'`
      )
      await db.rawQuery(
        `ALTER TABLE journal_entries
         DROP CONSTRAINT IF EXISTS journal_entries_emotion_check`
      )
      await db.rawQuery(
        `ALTER TABLE journal_entries
         ADD CONSTRAINT journal_entries_emotion_check
         CHECK (emotion IN ('devastated','sad','confused','neutral','hopeful','growing','thriving'))`
      )
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('custom_emotion')
    })
  }
}
