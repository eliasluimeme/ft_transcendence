import { Injectable } from '@nestjs/common';
import { CreateChatDmDto } from './dto/create-chat-dm.dto';


@Injectable()
export class ChatDmsService {
  typing(id: number) {
    throw new Error('Method not implemented.');
  }
  handelChatDm(data : any) {
    const message = {
      senderId: clientId,
      createdAt: new Date(),
    };
    return message;
  }

  findAll() {
    return `This action returns all chatDms`;
  }

}
