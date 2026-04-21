import vine from '@vinejs/vine'

export const listArticlesValidator = vine.compile(
  vine.object({
    category: vine
      .enum(['toxic-relationships', 'grief', 'trust', 'rebuilding', 'self-care'])
      .optional(),
    page: vine.number().positive().optional(),
    limit: vine.number().positive().max(50).optional(),
  })
)
