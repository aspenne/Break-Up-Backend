import vine from '@vinejs/vine'

export const createJournalEntryValidator = vine.compile(
  vine.object({
    promptId: vine.number().positive().optional(),
    title: vine.string().trim().minLength(1).maxLength(300),
    content: vine.string().trim().minLength(1),
    emotion: vine.enum([
      'devastated',
      'sad',
      'confused',
      'neutral',
      'hopeful',
      'growing',
      'thriving',
    ]),
  })
)

export const updateJournalEntryValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(300).optional(),
    content: vine.string().trim().minLength(1).optional(),
    emotion: vine
      .enum(['devastated', 'sad', 'confused', 'neutral', 'hopeful', 'growing', 'thriving'])
      .optional(),
  })
)
