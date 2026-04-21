import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ChatRoom from '#models/chat_room'
import Message from '#models/message'
import { DateTime } from 'luxon'

export default class ChatRoomSeeder extends BaseSeeder {
  async run() {
    const rooms = await ChatRoom.createMany([
      {
        name: 'Après la tempête',
        theme: 'grief',
        participantCount: 0,
        isDirectMessage: false,
        lastMessageAt: DateTime.now(),
      },
      {
        name: 'Sortir de la toxicité',
        theme: 'toxic-relationships',
        participantCount: 0,
        isDirectMessage: false,
        lastMessageAt: DateTime.now(),
      },
      {
        name: 'Reprendre confiance',
        theme: 'trust',
        participantCount: 0,
        isDirectMessage: false,
        lastMessageAt: DateTime.now(),
      },
      {
        name: 'Se reconstruire ensemble',
        theme: 'rebuilding',
        participantCount: 0,
        isDirectMessage: false,
        lastMessageAt: DateTime.now(),
      },
      {
        name: 'Prendre soin de soi',
        theme: 'self-care',
        participantCount: 0,
        isDirectMessage: false,
        lastMessageAt: DateTime.now(),
      },
    ])

    // Messages système de bienvenue pour chaque room
    const welcomeMessages: Record<string, string[]> = {
      'grief': [
        'Bienvenue dans ce salon. Ici, on parle du deuil amoureux sans jugement.',
        'Chaque rupture est un deuil. Prenez le temps qu\'il vous faut.',
        'Vous n\'êtes pas seul(e) à traverser cette épreuve.',
      ],
      'toxic-relationships': [
        'Bienvenue. Ce salon est un espace sûr pour parler des relations toxiques.',
        'Reconnaître une relation toxique, c\'est déjà un acte de courage.',
        'Ici, on écoute et on soutient. Pas de jugement.',
      ],
      'trust': [
        'Bienvenue dans cet espace dédié à la confiance.',
        'La confiance se reconstruit petit à petit. Soyez patient(e) avec vous-même.',
        'Partagez votre expérience, elle peut aider quelqu\'un d\'autre.',
      ],
      'rebuilding': [
        'Bienvenue ! Ce salon est fait pour ceux qui veulent avancer.',
        'Se reconstruire, c\'est pas recommencer de zéro — c\'est recommencer avec de l\'expérience.',
        'Chaque petit pas compte. Partagez vos victoires, même les plus petites.',
      ],
      'self-care': [
        'Bienvenue dans votre bulle de douceur.',
        'Prendre soin de soi n\'est pas égoïste, c\'est essentiel.',
        'Partagez vos rituels, vos découvertes, ce qui vous fait du bien.',
      ],
    }

    for (const room of rooms) {
      const messages = welcomeMessages[room.theme] ?? []
      for (const content of messages) {
        await Message.create({
          chatRoomId: room.id,
          senderId: null,
          senderName: 'BreakUp',
          content,
          isSystem: true,
        })
      }
    }
  }
}
