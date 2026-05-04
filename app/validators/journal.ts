import vine from '@vinejs/vine'

const EMOTIONS = [
  'devastated',
  'sad',
  'confused',
  'neutral',
  'hopeful',
  'growing',
  'thriving',
  'other',
] as const

export const createJournalEntryValidator = vine.compile(
  vine.object({
    promptId: vine.number().positive().optional(),
    title: vine.string().trim().minLength(1).maxLength(300),
    content: vine.string().trim().minLength(1),
    emotion: vine.enum(EMOTIONS),
    customEmotion: vine.string().trim().maxLength(80).optional(),
  })
)

export const updateJournalEntryValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1).maxLength(300).optional(),
    content: vine.string().trim().minLength(1).optional(),
    emotion: vine.enum(EMOTIONS).optional(),
    customEmotion: vine.string().trim().maxLength(80).nullable().optional(),
  })
)
