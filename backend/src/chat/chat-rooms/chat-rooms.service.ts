import { Injectable } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ChatRoomsService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  clientToUser = new Map<string, string>();

  identify(name: string, clientId: string) {
    this.clientToUser.set(clientId, name);
    return Object.values(this.clientToUser);
  }

  getClientName(clientId: string) {
    return this.clientToUser.get(clientId);
  }

  findAll() {
    return this.prisma.chatroom.findMany();
  }

  // add new message to the database
  async create(data: CreateChatRoomDto) {
    return await this.prisma.chatroom.create({
      data,
    });
  }

  // typing(@MessageBody('isTyping') isTyping: boolean, message: string) {
  //   // TODO: Implement the typing method that will write '{userName} is typing ...' in chatRoom.

  //   throw new Error('Method not implemented.');
  // }
}
