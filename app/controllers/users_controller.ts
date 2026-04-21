import type { HttpContext } from '@adonisjs/core/http'
import { updateProfileValidator } from '#validators/user'

export default class UsersController {
  async update({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(updateProfileValidator)

    user.merge(data)
    await user.save()

    return response.ok({ user: user.serialize() })
  }
}
