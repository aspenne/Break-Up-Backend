import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().normalizeEmail(),
    password: vine.string().minLength(8).maxLength(128),
    firstName: vine.string().trim().minLength(1).maxLength(50),
    lastName: vine.string().trim().minLength(1).maxLength(50),
    avatarEmoji: vine.string().trim().maxLength(10).optional(),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().normalizeEmail(),
    password: vine.string(),
  })
)

export const refreshValidator = vine.compile(
  vine.object({
    refreshToken: vine.string(),
  })
)

export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().normalizeEmail(),
  })
)

export const verifyResetCodeValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().normalizeEmail(),
    code: vine.string().fixedLength(6).regex(/^\d{6}$/),
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().normalizeEmail(),
    code: vine.string().fixedLength(6).regex(/^\d{6}$/),
    password: vine.string().minLength(8).maxLength(128),
  })
)
