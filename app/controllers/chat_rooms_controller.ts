import type { HttpContext } from '@adonisjs/core/http'
import ChatRoom from '#models/chat_room'
import ChatRoomMember from '#models/chat_room_member'
import { createRoomValidator } from '#validators/chat'
import { DateTime } from 'luxon'

export default class ChatRoomsController {
  async index({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const theme = request.input('theme')
    const isDirectMessage = request.input('isDirectMessage')

    const query = ChatRoom.query().orderBy('lastMessageAt', 'desc')

    if (theme) {
      query.where('theme', theme)
    }
    if (isDirectMessage !== undefined) {
      query.where('isDirectMessage', isDirectMessage === 'true')
    }

    const rooms = await query.paginate(page, limit)

    const memberRoomIds = await ChatRoomMember.query()
      .where('userId', user.id)
      .select('chatRoomId')

    const memberSet = new Set(memberRoomIds.map((m) => m.chatRoomId))

    const serialized = rooms.serialize()
    serialized.data = serialized.data.map((room: Record<string, unknown>) => ({
      ...room,
      isMember: memberSet.has(room.id as number),
    }))

    return response.ok(serialized)
  }

  async store({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(createRoomValidator)

    if (!data.isDirectMessage && data.theme) {
      const existing = await ChatRoom.query()
        .where('theme', data.theme)
        .where('isDirectMessage', false)
        .first()
      if (existing) {
        return response.conflict({
          message: 'A room with this theme already exists',
          room: existing,
        })
      }
    }

    const room = await ChatRoom.create({
      name: data.name,
      theme: data.theme,
      isDirectMessage: data.isDirectMessage ?? false,
      createdBy: user.id,
      participantCount: 1,
    })

    await ChatRoomMember.create({
      userId: user.id,
      chatRoomId: room.id,
      joinedAt: DateTime.now(),
    })

    return response.created(room)
  }

  async join({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const room = await ChatRoom.findOrFail(params.id)

    const existing = await ChatRoomMember.query()
      .where('userId', user.id)
      .where('chatRoomId', room.id)
      .first()

    if (existing) {
      return response.ok({ message: 'Already a member' })
    }

    await ChatRoomMember.create({
      userId: user.id,
      chatRoomId: room.id,
      joinedAt: DateTime.now(),
    })

    room.participantCount += 1
    await room.save()

    return response.ok({ message: 'Joined room' })
  }

  async leave({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const room = await ChatRoom.findOrFail(params.id)

    const member = await ChatRoomMember.query()
      .where('userId', user.id)
      .where('chatRoomId', room.id)
      .first()

    if (!member) {
      return response.notFound({ message: 'Not a member of this room' })
    }

    await member.delete()

    room.participantCount = Math.max(0, room.participantCount - 1)
    await room.save()

    return response.ok({ message: 'Left room' })
  }
}
