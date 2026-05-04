import { BaseSeeder } from '@adonisjs/lucid/seeders'
import JournalPrompt from '#models/journal_prompt'

export default class JournalPromptSeeder extends BaseSeeder {
  async run() {
    await JournalPrompt.updateOrCreateMany('question', [
      // Premiers jours (0-14)
      {
        question: 'Comment te sens-tu, ici et maintenant ? Pose tes mots, sans filtre.',
        category: 'feelings',
        dayRangeMin: 0,
        dayRangeMax: 14,
      },
      {
        question: 'Quelle émotion revient le plus souvent ces derniers jours ?',
        category: 'feelings',
        dayRangeMin: 0,
        dayRangeMax: 14,
      },
      {
        question: "Qu'est-ce qui t'a le plus bouleversé(e) dans cette rupture ?",
        category: 'grief',
        dayRangeMin: 0,
        dayRangeMax: 14,
      },
      {
        question: "Cite trois petites choses pour lesquelles tu peux dire merci aujourd'hui.",
        category: 'gratitude',
        dayRangeMin: 0,
        dayRangeMax: 14,
      },
      // Phase de transition (15-30)
      {
        question: "Qu'as-tu appris sur toi-même au fil de cette relation ?",
        category: 'reflection',
        dayRangeMin: 15,
        dayRangeMax: 30,
      },
      {
        question: 'Quelles limites aimerais-tu poser dans tes prochaines relations ?',
        category: 'growth',
        dayRangeMin: 15,
        dayRangeMax: 30,
      },
      {
        question: "Écris une lettre à ton ex que tu n'enverras jamais. Dis tout, sans retenue.",
        category: 'release',
        dayRangeMin: 15,
        dayRangeMax: 30,
      },
      // Phase de croissance (31-90)
      {
        question: "Qu'est-ce que tu fais aujourd'hui que tu ne faisais plus il y a un mois ?",
        category: 'progress',
        dayRangeMin: 31,
        dayRangeMax: 90,
      },
      {
        question: 'Décris la personne que tu as envie de devenir, dans six mois.',
        category: 'vision',
        dayRangeMin: 31,
        dayRangeMax: 90,
      },
      {
        question: "Écris une lettre de pardon\n(à toi-même).",
        category: 'healing',
        dayRangeMin: 31,
        dayRangeMax: 90,
      },
      // Phase de reconstruction (91-180)
      {
        question: "Qu'est-ce qui te rend heureux(se), simplement, en ce moment ?",
        category: 'joy',
        dayRangeMin: 91,
        dayRangeMax: 180,
      },
      {
        question:
          'Si tu pouvais murmurer une phrase à ton toi du jour de la rupture, ce serait laquelle ?',
        category: 'wisdom',
        dayRangeMin: 91,
        dayRangeMax: 180,
      },
      // Phase d'épanouissement (181+)
      {
        question: 'En quoi cette épreuve t-a rendu(e) plus fort(e) ?',
        category: 'strength',
        dayRangeMin: 181,
        dayRangeMax: 365,
      },
      {
        question: 'Quels sont tes rêves pour les six prochains mois ?',
        category: 'future',
        dayRangeMin: 181,
        dayRangeMax: 365,
      },
    ])
  }
}
