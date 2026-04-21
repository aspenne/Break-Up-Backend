import vine from '@vinejs/vine'

export const updateProfileValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(1).maxLength(50).optional(),
    lastName: vine.string().trim().minLength(1).maxLength(50).optional(),
    avatarEmoji: vine.string().trim().maxLength(10).optional(),
    breakupDate: vine
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
  })
)
