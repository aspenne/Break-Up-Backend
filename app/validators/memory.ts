import vine from '@vinejs/vine'

export const createMemoryValidator = vine.compile(
  vine.object({
    uri: vine.string().trim().maxLength(500),
    thumbnailUri: vine.string().trim().maxLength(500).optional(),
    dateTaken: vine
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    stage: vine.enum(['identified', 'hidden', 'archived', 'deleted']).optional(),
  })
)

export const updateMemoryValidator = vine.compile(
  vine.object({
    stage: vine.enum(['identified', 'hidden', 'archived', 'deleted']),
  })
)
