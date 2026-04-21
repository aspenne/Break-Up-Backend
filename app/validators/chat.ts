import vine from '@vinejs/vine'

export const createRoomValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(200),
    theme: vine.string().trim().minLength(1).maxLength(100),
    isDirectMessage: vine.boolean().optional(),
  })
)

export const createMessageValidator = vine.compile(
  vine.object({
    content: vine.string().trim().minLength(1).maxLength(5000),
    senderName: vine.string().trim().maxLength(100).optional(),
  })
)
