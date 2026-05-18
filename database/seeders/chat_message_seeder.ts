import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ChatRoom from '#models/chat_room'
import Message from '#models/message'
import { DateTime } from 'luxon'

type Msg = { who: string; text: string; hoursAgo: number }

const CONVERSATIONS: Record<string, Msg[]> = {
  grief: [
    { who: 'Anonyme',  text: "Première fois que j'écris ici. 3 semaines après la rupture et j'ai encore l'impression que c'est arrivé hier.", hoursAgo: 72 },
    { who: 'Léa',      text: "Bienvenue. Le temps fait son œuvre mais il triche parfois. Tu as le droit de pleurer autant que tu en as besoin.", hoursAgo: 71 },
    { who: 'Anonyme',  text: "Merci. Je culpabilise de ne pas \"aller mieux\" assez vite.", hoursAgo: 70 },
    { who: 'Marc',     text: "Il n'y a pas de bon rythme. Moi ça fait 4 mois et certains jours ça revient sans prévenir.", hoursAgo: 68 },
    { who: 'Sarah',    text: "Une thérapeute m'a dit : le deuil amoureux suit les mêmes étapes qu'un vrai deuil. Sois patient(e) avec toi.", hoursAgo: 48 },
    { who: 'Anonyme',  text: "Ça fait du bien de lire ça. Je me sentais seul à ressentir ça aussi fort.", hoursAgo: 47 },
    { who: 'Léa',      text: "Tu n'es vraiment pas seul(e). On est plusieurs à passer par là 💙", hoursAgo: 46 },
    { who: 'Émilie',   text: "Petit conseil qui m'a sauvée : éviter les playlists d'avant pendant un temps. Crée-toi une nouvelle bande son.", hoursAgo: 24 },
    { who: 'Marc',     text: "Bonne idée. Pour moi c'est les podcasts qui ont aidé, ça occupe la tête.", hoursAgo: 23 },
    { who: 'Anonyme',  text: "Je vais essayer ça ce week-end. Merci à vous tous.", hoursAgo: 6 },
    { who: 'Sarah',    text: "Courage 🌱", hoursAgo: 5 },
  ],

  'toxic-relationships': [
    { who: 'Camille',  text: "Je viens de réaliser que c'était toxique. 5 ans. Je me sens stupide.", hoursAgo: 96 },
    { who: 'Anonyme',  text: "Tu n'es pas stupide. La manipulation se voit rarement de l'intérieur. T'en sortir c'est déjà énorme.", hoursAgo: 95 },
    { who: 'Théo',     text: "Pareil pour moi, 7 ans. J'ai mis des mois à oser en parler.", hoursAgo: 94 },
    { who: 'Camille',  text: "Comment vous avez fait pour ne plus douter de votre perception ?", hoursAgo: 72 },
    { who: 'Léa',      text: "Tenir un journal. Écrire les faits, pas les justifications qu'on te donnait. Relu à froid c'est édifiant.", hoursAgo: 71 },
    { who: 'Anonyme',  text: "+1 sur le journal. Aussi : couper les contacts au moins quelques semaines. Sinon on retombe.", hoursAgo: 70 },
    { who: 'Théo',     text: "Et un suivi psy si possible. Le gaslighting laisse des traces.", hoursAgo: 48 },
    { who: 'Camille',  text: "J'ai pris rendez-vous la semaine prochaine. Je vais essayer le journal aussi.", hoursAgo: 12 },
    { who: 'Léa',      text: "Bravo, c'est une vraie démarche. Tiens-nous au courant 💪", hoursAgo: 11 },
  ],

  trust: [
    { who: 'Anonyme',  text: "J'ai rencontré quelqu'un de bien, mais je n'arrive pas à lui faire confiance. C'est injuste pour lui.", hoursAgo: 120 },
    { who: 'Inès',     text: "Tu as parlé de tes peurs avec lui ?", hoursAgo: 119 },
    { who: 'Anonyme',  text: "Pas vraiment, j'ai peur qu'il fuie.", hoursAgo: 118 },
    { who: 'Marc',     text: "Quelqu'un de bien restera. Et s'il ne reste pas, tu auras gagné du temps.", hoursAgo: 96 },
    { who: 'Inès',     text: "La confiance se reconstruit par petites preuves, des deux côtés. Y aller doucement.", hoursAgo: 72 },
    { who: 'Sarah',    text: "Une chose qui m'a aidée : distinguer \"il/elle me ment\" de \"j'ai peur qu'il/elle me mente\".", hoursAgo: 48 },
    { who: 'Anonyme',  text: "Merci, c'est exactement ça que je confonds. Je vais essayer de lui en parler ce week-end.", hoursAgo: 6 },
  ],

  rebuilding: [
    { who: 'Julien',   text: "1 an aujourd'hui depuis la rupture. Je voulais juste partager : ça va beaucoup mieux. Vraiment.", hoursAgo: 144 },
    { who: 'Léa',      text: "🌱 Merci pour ce message, ça fait du bien à lire quand on est encore dans le brouillard.", hoursAgo: 143 },
    { who: 'Anonyme',  text: "Qu'est-ce qui a le plus aidé ?", hoursAgo: 120 },
    { who: 'Julien',   text: "Le sport (course tranquille au début), reprendre des hobbies abandonnés, et entourer mieux.", hoursAgo: 119 },
    { who: 'Émilie',   text: "J'ai démarré la poterie cette année après ma rupture. Aucune ambition, juste pour les mains. Game changer.", hoursAgo: 96 },
    { who: 'Théo',     text: "Idem avec la guitare. Avoir un truc à soi qui n'a rien à voir avec l'ex.", hoursAgo: 72 },
    { who: 'Anonyme',  text: "Je note. Je vais retenter le piano, j'avais arrêté à cause d'elle. Bizarre comme on s'efface dans une relation parfois.", hoursAgo: 48 },
    { who: 'Julien',   text: "Exactement ça. Reprendre ce qu'on aimait, c'est se retrouver. Bon courage 💙", hoursAgo: 24 },
  ],

  'self-care': [
    { who: 'Sarah',    text: "Rituel du matin depuis 2 mois : 10 min de marche dehors avant de regarder mon téléphone. Ça change tout.", hoursAgo: 168 },
    { who: 'Inès',     text: "J'ai testé pendant une semaine, je confirme. Et lecture le soir au lieu de scroll.", hoursAgo: 167 },
    { who: 'Anonyme',  text: "Comment vous faites pour ne pas allumer le téléphone direct ?", hoursAgo: 144 },
    { who: 'Léa',      text: "Mode avion la nuit + chargeur loin du lit. Radical mais efficace.", hoursAgo: 143 },
    { who: 'Émilie',   text: "Je rajoute : une vraie playlist douce le matin. Pas de news, pas de notifs.", hoursAgo: 96 },
    { who: 'Camille',  text: "Et un carnet papier à côté du lit pour vider la tête avant de dormir.", hoursAgo: 72 },
    { who: 'Anonyme',  text: "Génial, je vais piocher dans tout ça cette semaine. Merci 🌿", hoursAgo: 12 },
  ],
}

export default class ChatMessageSeeder extends BaseSeeder {
  async run() {
    const rooms = await ChatRoom.query().where('isDirectMessage', false)
    const now = DateTime.now()

    for (const room of rooms) {
      const convo = CONVERSATIONS[room.theme]
      if (!convo) continue

      // Skip if non-system messages already exist (don't duplicate on re-seed)
      const existing = await Message.query()
        .where('chatRoomId', room.id)
        .where('isSystem', false)
        .first()
      if (existing) continue

      // Insert in chronological order so createdAt is ascending
      const ordered = [...convo].sort((a, b) => b.hoursAgo - a.hoursAgo)

      let lastSentAt = now
      for (const m of ordered) {
        const sentAt = now.minus({ hours: m.hoursAgo })
        await Message.create({
          chatRoomId: room.id,
          senderId: null,
          senderName: m.who,
          content: m.text,
          isSystem: false,
          createdAt: sentAt,
          updatedAt: sentAt,
        })
        lastSentAt = sentAt
      }

      // Bump room.lastMessageAt and participantCount roughly
      room.lastMessageAt = lastSentAt
      const distinctSenders = new Set(convo.map((m) => m.who))
      room.participantCount = Math.max(room.participantCount ?? 0, distinctSenders.size)
      await room.save()
    }
  }
}
