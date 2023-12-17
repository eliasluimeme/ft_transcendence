import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  createRoomConversation(
    msgRoomId: number,
    MessageSenId: number,
    textContent: string,
  ):
    | import('../messages/entities/message.entity').Message
    | PromiseLike<import('../messages/entities/message.entity').Message> {
    throw new Error('Method not implemented.');
  }
  getConversation(): Promise<Message[]> {
    try {
      return this.prisma.message.findMany();
    } catch {
      throw new UnauthorizedException('Conversation Not Found.');
    }
  }
  createChatConversation(
    msgId: number,
    userSenderId: number,
    msgContent: string,
  ): Promise<Message> {
    throw new Error('Method not implemented.');
  }
  create(createConversationDto: CreateConversationDto) {
    return 'This action adds a new conversation';
  }

  findAll() {
    return `This action returns all conversation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} conversation`;
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
