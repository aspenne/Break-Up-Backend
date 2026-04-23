import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'

export default class RoleSeeder extends BaseSeeder {
  async run() {
    await Role.updateOrCreateMany('name', [
      { name: 'user', description: 'Utilisateur standard' },
      { name: 'admin', description: 'Administrateur avec accès complet' },
    ])
  }
}
