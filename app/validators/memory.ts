import vine from '@vinejs/vine'

export const createMemoryValidator = vine.compile(
  vine.object({
    assetId: vine.string().trim().maxLength(255).optional(),
    uri: vine.string().trim().maxLength(500),
    thumbnailUri: vine.string().trim().maxLength(500).optional(),
    // Accept either a date (YYYY-MM-DD) or a full ISO 8601 datetime.
    // The Memory.dateTaken column is @column.date() so Lucid will truncate
    // to the date part when persisting.
    dateTaken: vine
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/)
      .optional(),
    stage: vine.enum(['identified', 'hidden', 'archived', 'deleted']).optional(),
  })
)

export const updateMemoryValidator = vine.compile(
  vine.object({
    stage: vine.enum(['identified', 'hidden', 'archived', 'deleted']),
  })
)
