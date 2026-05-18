import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'memories'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('asset_id', 255).nullable()
      table.index(['user_id', 'asset_id'], 'memories_user_asset_idx')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['user_id', 'asset_id'], 'memories_user_asset_idx')
      table.dropColumn('asset_id')
    })
  }
}
