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

export const createArticleValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(200),
    excerpt: vine.string().trim().minLength(3).maxLength(500).optional(),
    content: vine.string().trim().minLength(10),
    category: vine.enum(['toxic-relationships', 'grief', 'trust', 'rebuilding', 'self-care']),
    readTimeMinutes: vine.number().positive().max(120),
    imageUrl: vine.string().trim().url().optional(),
  })
)
