import { Injectable } from '@nestjs/common';
import { CreateChatDmDto } from './dto/create-chat-dm.dto';


@Injectable()
export class ChatDmsService {
  typing(id: number) {
    throw new Error('Method not implemented.');
  }
  create(createChatDmDto: CreateChatDmDto) {
    return 'This action adds a new chatDm';
  }

  findAll() {
    return `This action returns all chatDms`;
  }

}
