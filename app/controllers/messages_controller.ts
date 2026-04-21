import type { HttpContext } from '@adonisjs/core/http'
import Message from '#models/message'
import ChatRoom from '#models/chat_room'
import ChatRoomMember from '#models/chat_room_member'
import { createMessageValidator } from '#validators/chat'
import { DateTime } from 'luxon'

export default class MessagesController {
  async index({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const room = await ChatRoom.findOrFail(params.id)

    const member = await ChatRoomMember.query()
      .where('userId', user.id)
      .where('chatRoomId', room.id)
      .first()

    if (!member) {
      return response.forbidden({ message: 'You must join this room first' })
    }

    const page = request.input('page', 1)
    const limit = request.input('limit', 50)

    const messages = await Message.query()
      .where('chatRoomId', room.id)
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    return response.ok(messages)
  }

  async store({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const room = await ChatRoom.findOrFail(params.id)
    const data = await request.validateUsing(createMessageValidator)

    const member = await ChatRoomMember.query()
      .where('userId', user.id)
      .where('chatRoomId', room.id)
      .first()

    if (!member) {
      return response.forbidden({ message: 'You must join this room first' })
    }

    const message = await Message.create({
      chatRoomId: room.id,
      senderId: user.id,
      senderName: data.senderName ?? `${user.firstName} ${user.lastName}`,
      content: data.content,
      isSystem: false,
    })

    room.lastMessageAt = DateTime.now()
    await room.save()

    return response.created(message)
  }
}
