import { BaseSeeder } from '@adonisjs/lucid/seeders'
import JournalEntry from '#models/journal_entry'
import User from '#models/user'
import { DateTime } from 'luxon'

type Emotion =
  | 'devastated'
  | 'sad'
  | 'confused'
  | 'neutral'
  | 'hopeful'
  | 'growing'
  | 'thriving'
  | 'other'

interface SampleEntry {
  offset: number
  emotion: Emotion
  customEmotion?: string
  title: string
  content: string
}

/**
 * Entrées de démo réparties sur les 21 derniers jours, plusieurs par jour
 * sur certaines dates pour rendre la timeline et le calendrier denses.
 * Inclut quelques entrées emotion='other' avec customEmotion pour montrer
 * la fonctionnalité.
 */
const SAMPLE: SampleEntry[] = [
  // Phase 1 — choc (j-21 à j-15)
  { offset: 21, emotion: 'devastated', title: 'Le vide',          content: "Tout s'effondre. J'ai du mal à respirer." },
  { offset: 21, emotion: 'sad',        title: 'Soir difficile',   content: "Je n'arrive pas à dormir. Je tourne en rond." },
  { offset: 20, emotion: 'devastated', title: 'Insomnie',         content: 'Encore une nuit blanche. Mon esprit tourne en boucle.' },
  { offset: 19, emotion: 'sad',        title: 'Larmes silencieuses', content: 'Pleuré dans le métro. Personne ne remarque.' },
  { offset: 18, emotion: 'confused',   title: 'Pourquoi ?',       content: "Je n'arrive pas à comprendre ce qui s'est passé." },
  { offset: 17, emotion: 'sad',        title: 'Sa chanson',       content: 'Cette chanson à la radio... ça fait mal.' },
  { offset: 16, emotion: 'other',      customEmotion: 'à fleur de peau', title: 'Trop sensible', content: 'Tout me touche aujourd’hui. Un sourire, une phrase. Je laisse passer.' },
  { offset: 15, emotion: 'confused',   title: 'Doutes',           content: "Et si je m'étais trompé(e) sur tout ?" },

  // Phase 2 — transition (j-14 à j-8)
  { offset: 14, emotion: 'sad',        title: 'Petit mieux',      content: "J'ai pu manger un vrai repas aujourd'hui." },
  { offset: 13, emotion: 'neutral',    title: 'Routine',          content: "La journée est passée, c'est déjà ça." },
  { offset: 12, emotion: 'neutral',    title: 'Café avec Sarah',  content: "Ça fait du bien d'en parler. Elle écoute sans juger." },
  { offset: 11, emotion: 'other',      customEmotion: 'nostalgique', title: 'Souvenirs', content: 'Je suis tombé(e) sur une vieille photo. Étrangement, ça ne fait plus mal.' },
  { offset: 10, emotion: 'hopeful',    title: 'Première balade',  content: "J'ai marché une heure dans le parc. Le soleil aide." },
  { offset: 9,  emotion: 'hopeful',    title: 'Projet voyage',    content: "Je commence à penser à un week-end en solo." },
  { offset: 9,  emotion: 'neutral',    title: 'Le soir',          content: 'Journée OK, soirée plus calme que d’habitude.' },
  { offset: 8,  emotion: 'growing',    title: 'Reprise course',   content: "J'ai repris la course. Mon corps me remercie." },

  // Phase 3 — reconstruction (j-7 à j-3)
  { offset: 7,  emotion: 'growing',    title: 'Lecture',          content: "Un livre sur l'estime de soi. Je prends des notes." },
  { offset: 6,  emotion: 'hopeful',    title: 'Soirée entre amis', content: 'Première fois que je ris vraiment depuis longtemps.' },
  { offset: 5,  emotion: 'growing',    title: 'Routine matinale', content: 'Réveil tôt, méditation, journal. Ça pose la journée.' },
  { offset: 5,  emotion: 'other',      customEmotion: 'fier(e) de moi', title: 'Premier non', content: "J'ai dit non à une demande qui ne me convenait pas. Fier(e) de moi." },
  { offset: 4,  emotion: 'thriving',   title: 'Liberté',          content: "Je réalise tout ce que je peux faire pour moi maintenant." },
  { offset: 3,  emotion: 'growing',    title: 'Nouveau hobby',    content: 'Première séance de poterie. Mes mains me reconnectent à moi.' },

  // Phase 4 — moment présent (j-2 à aujourd'hui)
  { offset: 2,  emotion: 'thriving',   title: 'Gratitude',        content: 'Merci à moi-même pour tout le chemin parcouru.' },
  { offset: 2,  emotion: 'hopeful',    title: 'Soirée tranquille', content: "Lecture, tisane, bougie. C'est tout ce qu'il me faut ce soir." },
  { offset: 1,  emotion: 'growing',    title: 'Limites posées',   content: "J'ai recoupé avec quelqu'un qui me tirait vers le bas." },
  { offset: 1,  emotion: 'other',      customEmotion: 'en paix',  title: 'Calme intérieur', content: 'Aucune urgence, aucun bruit dans la tête. Une vraie pause.' },
  { offset: 0,  emotion: 'hopeful',    title: "Aujourd'hui",      content: "Une journée normale, et c'est déjà une victoire." },
  { offset: 0,  emotion: 'thriving',   title: 'Bonne énergie',    content: 'Je me suis surpris(e) à siffloter ce matin. Petite chose, grande joie.' },
]

export default class JournalEntrySeeder extends BaseSeeder {
  async run() {
    const user = await User.first()
    if (!user) {
      console.log('JournalEntrySeeder: aucun utilisateur trouvé, skip.')
      return
    }

    // Wipe previous demo entries for this user so the timeline stays clean
    await JournalEntry.query().where('userId', user.id).delete()

    const now = DateTime.now()
    let createdAtCursor = now

    // Sort newest-first so we can stagger times within the same day
    const ordered = [...SAMPLE].sort((a, b) => a.offset - b.offset)

    let lastOffset = -1
    let perDayCount = 0

    for (const s of ordered) {
      if (s.offset === lastOffset) {
        perDayCount++
      } else {
        perDayCount = 0
        lastOffset = s.offset
      }

      // Stagger same-day entries: 9h30, 14h00, 21h00
      const hours = [9, 14, 21]
      const hour = hours[Math.min(perDayCount, hours.length - 1)]

      createdAtCursor = now.minus({ days: s.offset }).set({ hour, minute: 30 })

      await JournalEntry.create({
        userId: user.id,
        promptId: null,
        title: s.title,
        content: s.content,
        emotion: s.emotion,
        customEmotion: s.emotion === 'other' ? (s.customEmotion ?? null) : null,
        createdAt: createdAtCursor,
        updatedAt: createdAtCursor,
      })
    }

    console.log(`JournalEntrySeeder: ${SAMPLE.length} entries seeded for ${user.email}`)
  }
}
