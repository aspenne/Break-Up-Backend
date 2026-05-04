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

const SAMPLE: { offset: number; emotion: Emotion; title: string; content: string }[] = [
  { offset: 27, emotion: 'devastated', title: 'Le vide', content: "Tout s'effondre. J'ai du mal a respirer." },
  { offset: 26, emotion: 'devastated', title: 'Insomnie', content: 'Encore une nuit blanche. Mon esprit tourne en boucle.' },
  { offset: 24, emotion: 'sad', title: 'Larmes silencieuses', content: 'Pleure dans le metro. Personne ne remarque.' },
  { offset: 22, emotion: 'sad', title: 'Souvenirs partout', content: 'Cette chanson a la radio... ca fait mal.' },
  { offset: 20, emotion: 'confused', title: 'Pourquoi ?', content: "Je n'arrive pas a comprendre ce qui s'est passe." },
  { offset: 18, emotion: 'confused', title: 'Doutes', content: 'Et si je m\'etais trompe(e) sur tout ?' },
  { offset: 16, emotion: 'sad', title: 'Petit mieux', content: "J'ai pu manger un vrai repas aujourd'hui." },
  { offset: 14, emotion: 'neutral', title: 'Routine', content: "La journee est passee, c'est deja ca." },
  { offset: 12, emotion: 'neutral', title: 'Cafe avec une amie', content: "Ca fait du bien d'en parler." },
  { offset: 10, emotion: 'hopeful', title: 'Premiere balade', content: "J'ai marche une heure dans le parc. Le soleil aide." },
  { offset: 9, emotion: 'hopeful', title: 'Projet', content: "Je commence a penser a un voyage en solo." },
  { offset: 7, emotion: 'growing', title: 'Sport', content: "J'ai repris la course. Mon corps me remercie." },
  { offset: 6, emotion: 'growing', title: 'Lecture', content: "Un livre sur l'estime de soi. Je prends des notes." },
  { offset: 5, emotion: 'hopeful', title: 'Soiree entre amis', content: 'Premiere fois que je ris vraiment depuis longtemps.' },
  { offset: 4, emotion: 'growing', title: 'Nouvelle routine matinale', content: 'Reveil tot, meditation, journal. Ca pose la journee.' },
  { offset: 3, emotion: 'thriving', title: 'Liberte', content: "Je realise tout ce que je peux faire pour moi maintenant." },
  { offset: 2, emotion: 'growing', title: 'Limites', content: "J'ai dit non a une demande qui ne me convenait pas. Fier(e) de moi." },
  { offset: 1, emotion: 'thriving', title: 'Gratitude', content: 'Merci a moi-meme pour tout le chemin parcouru.' },
  { offset: 0, emotion: 'hopeful', title: "Aujourd'hui", content: "Une journee normale, et c'est deja une victoire." },
]

export default class JournalEntrySeeder extends BaseSeeder {
  async run() {
    const user = await User.first()
    if (!user) {
      console.log('JournalEntrySeeder: aucun utilisateur trouve, skip.')
      return
    }

    const now = DateTime.now()
    for (const s of SAMPLE) {
      const created = now.minus({ days: s.offset }).set({ hour: 9, minute: 30 })
      await JournalEntry.create({
        userId: user.id,
        promptId: null,
        title: s.title,
        content: s.content,
        emotion: s.emotion,
        createdAt: created,
        updatedAt: created,
      })
    }
  }
}
