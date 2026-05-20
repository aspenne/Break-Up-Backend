import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { updateProfileValidator } from '#validators/user'

export default class UsersController {
  async update({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(updateProfileValidator)

    // breakupDate arrives as 'YYYY-MM-DD' from the validator, but the model
    // column is @column.date() so it needs a DateTime instance.
    const { breakupDate, ...rest } = data
    user.merge({
      ...rest,
      ...(breakupDate !== undefined
        ? { breakupDate: breakupDate ? DateTime.fromISO(breakupDate) : null }
        : {}),
    })
    await user.save()

    return response.ok({ user: user.serialize() })
  }
}
