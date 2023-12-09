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
    return this.prisma.chatRoom.findMany();
  }

  // add new message to the database
  async create(data: CreateChatRoomDto) {
    return await this.prisma.chatRoom.create({
      data,
    });
  }

  typing(@MessageBody('isTyping') isTyping: boolean, message: string) {
    // TODO: Implement the typing method that will write '{userName} is typing ...' in chatRoom.

    throw new Error('Method not implemented.');
  }
}

// @Injectable()
// export class ChatRoomsService {
//   prisma = new PrismaClient();

//   create(createChatRoomDto: CreateChatRoomDto) {
//     return 'This action adds a new chatRoom';
//   }

//   findAll() {
//     return this.prisma.chatRoom.findMany();
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} chatRoom`;
//   }

//   update(id: number, updateChatRoomDto: UpdateChatRoomDto) {
//     return `This action updates a #${id} chatRoom`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} chatRoom`;
//   }
// }
