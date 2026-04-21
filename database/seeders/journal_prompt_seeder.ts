import { BaseSeeder } from '@adonisjs/lucid/seeders'
import JournalPrompt from '#models/journal_prompt'

export default class JournalPromptSeeder extends BaseSeeder {
  async run() {
    await JournalPrompt.createMany([
      // Early days (0-14)
      {
        question: 'Comment vous sentez-vous en ce moment ? Ecrivez ce qui vous vient sans filtre.',
        category: 'feelings',
        dayRangeMin: 0,
        dayRangeMax: 14,
      },
      {
        question: "Qu'est-ce qui vous a fait le plus mal dans cette rupture ?",
        category: 'grief',
        dayRangeMin: 0,
        dayRangeMax: 14,
      },
      {
        question:
          "Nommez 3 choses pour lesquelles vous etes reconnaissant(e) aujourd'hui.",
        category: 'gratitude',
        dayRangeMin: 0,
        dayRangeMax: 14,
      },
      // Transition phase (15-30)
      {
        question: "Qu'avez-vous appris sur vous-meme dans cette relation ?",
        category: 'reflection',
        dayRangeMin: 15,
        dayRangeMax: 30,
      },
      {
        question:
          'Quelles limites aimeriez-vous poser dans vos futures relations ?',
        category: 'growth',
        dayRangeMin: 15,
        dayRangeMax: 30,
      },
      {
        question:
          'Ecrivez une lettre a votre ex que vous n\'enverrez jamais. Dites tout.',
        category: 'release',
        dayRangeMin: 15,
        dayRangeMax: 30,
      },
      // Growth phase (31-90)
      {
        question:
          "Qu'est-ce que vous faites aujourd'hui que vous ne faisiez pas il y a un mois ?",
        category: 'progress',
        dayRangeMin: 31,
        dayRangeMax: 90,
      },
      {
        question: 'Decrivez la personne que vous voulez devenir.',
        category: 'vision',
        dayRangeMin: 31,
        dayRangeMax: 90,
      },
      {
        question: 'Ecrivez une lettre de pardon — a vous-meme.',
        category: 'healing',
        dayRangeMin: 31,
        dayRangeMax: 90,
      },
      // Rebuilding phase (91-180)
      {
        question: "Qu'est-ce qui vous rend heureux(se) en ce moment ?",
        category: 'joy',
        dayRangeMin: 91,
        dayRangeMax: 180,
      },
      {
        question:
          'Si vous pouviez dire une chose a votre ancien moi le jour de la rupture, ce serait quoi ?',
        category: 'wisdom',
        dayRangeMin: 91,
        dayRangeMax: 180,
      },
      // Thriving phase (181+)
      {
        question: 'Comment cette experience vous a-t-elle rendu(e) plus fort(e) ?',
        category: 'strength',
        dayRangeMin: 181,
        dayRangeMax: 365,
      },
      {
        question: 'Quels sont vos reves pour les 6 prochains mois ?',
        category: 'future',
        dayRangeMin: 181,
        dayRangeMax: 365,
      },
    ])
  }
}
